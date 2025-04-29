import asyncio
import sys
import os
import logging
from pathlib import Path

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.crawl_service import get_pydantic_ai_docs_urls, crawl_parallel

# Create log directory if it doesn't exist
log_dir = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
log_file = log_dir / "crawl_rag.log"

# Configure logging with absolute path
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(str(log_file), mode='w'),  # Use 'w' to start fresh each run
        logging.StreamHandler()
    ]
)

async def main():
    try:
        logging.info("Starting Crawl_RAG application")
        
        # Get URLs from Pydantic AI docs
        urls = get_pydantic_ai_docs_urls()
        if not urls:
            logging.error("No URLs found to crawl")
            return
        
        logging.info(f"Found {len(urls)} URLs to crawl")
        
        # Limit to a smaller subset for testing first - REDUCED TO 5
        test_limit = 5  # Reduced from 10 to 5
        test_urls = urls[:test_limit]
        logging.info(f"Processing first {len(test_urls)} URLs as a test batch")
        
        await crawl_parallel(test_urls)
    except Exception as e:
        logging.error(f"Error in main process: {e}", exc_info=True)

if __name__ == "__main__":
    asyncio.run(main())