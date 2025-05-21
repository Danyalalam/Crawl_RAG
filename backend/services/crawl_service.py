import asyncio
import requests
from typing import List
import logging
from xml.etree import ElementTree
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

from backend.config.settings import DEFAULT_MAX_CONCURRENT
from backend.services.document_service import process_and_store_document

async def crawl_parallel(urls: List[str], max_concurrent: int = DEFAULT_MAX_CONCURRENT):
    """Crawl multiple URLs in parallel with a concurrency limit."""
    browser_config = BrowserConfig(
        headless=True,
        verbose=False,
        extra_args=["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"],
    )
    crawl_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    # Create the crawler instance
    crawler = AsyncWebCrawler(config=browser_config)
    await crawler.start()

    try:
        # Create a semaphore to limit concurrency
        semaphore = asyncio.Semaphore(max_concurrent)
        
        async def process_url(url: str):
            async with semaphore:
                try:
                    logging.info(f"Crawling: {url}")
                    result = await crawler.arun(
                        url=url,
                        config=crawl_config,
                        session_id="hbl_session"  # Changed to hbl_session
                    )
                    
                    if result.success:
                        logging.info(f"Successfully crawled: {url}")
                        # Handle different versions of the API
                        markdown_content = ""
                        if hasattr(result, 'markdown_v2'):
                            markdown_content = result.markdown_v2.raw_markdown
                        elif hasattr(result, 'markdown'):
                            markdown_content = result.markdown
                            
                        await process_and_store_document(url, markdown_content)
                    else:
                        logging.error(f"Failed: {url} - Error: {result.error_message}")
                        
                    # Add delay between crawls to avoid overloading APIs
                    await asyncio.sleep(8)  # Increased delay
                except Exception as e:
                    logging.error(f"Error processing URL {url}: {e}")
        
        # Process URLs sequentially for better rate limit management
        for url in urls:
            await process_url(url)
            # Add a substantial delay between URLs
            logging.info(f"Completed processing URL: {url}, pausing before next URL")
            await asyncio.sleep(15)  # Increased delay between URLs
            
    finally:
        await crawler.close()

def get_hbl_sitemap_urls() -> List[str]:
    """Get URLs from the HBL sitemap."""
    # Load HBL sitemap from file instead of fetching it
    try:
        with open('d:\\Crawl_RAG\\hbl_sitmap.txt', 'r') as f:
            content = f.read()
        
        # Parse the XML
        root = ElementTree.fromstring(content)
        
        # Extract all URLs from the sitemap
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = [loc.text for loc in root.findall('.//ns:loc', namespace)]
        
        logging.info(f"Loaded {len(urls)} URLs from HBL sitemap file")
        return urls
    except Exception as e:
        logging.error(f"Error loading HBL sitemap: {e}")
        return []

# # Keep the old function for reference but add the new one
# def get_pydantic_ai_docs_urls() -> List[str]:
#     """Get URLs from Pydantic AI docs sitemap."""
#     return get_sitemap_urls("https://ai.pydantic.dev/sitemap.xml")

# def get_sitemap_urls(sitemap_url: str) -> List[str]:
#     """Get URLs from a sitemap."""
#     try:
#         response = requests.get(sitemap_url)
#         response.raise_for_status()
        
#         # Parse the XML
#         root = ElementTree.fromstring(response.content)
        
#         # Extract all URLs from the sitemap
#         namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
#         urls = [loc.text for loc in root.findall('.//ns:loc', namespace)]
        
#         return urls
#     except Exception as e:
#         logging.error(f"Error fetching sitemap: {e}")
#         return []