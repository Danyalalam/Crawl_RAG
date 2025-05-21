import asyncio
import sys
import os
import logging
from pathlib import Path

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.crawl_service import get_hbl_sitemap_urls, crawl_parallel

# Create log directory if it doesn't exist
log_dir = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
log_file = log_dir / "hbl_crawl_rag.log"

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
        logging.info("Starting HBL Crawl_RAG application")
        
        # Get URLs from HBL sitemap
        urls = get_hbl_sitemap_urls()
        if not urls:
            logging.error("No HBL URLs found to crawl")
            return
        
        logging.info(f"Found {len(urls)} HBL URLs to crawl")
        
        # Process in small batches due to API limits
        # Total URLs is much larger, so we'll need even smaller batches
        batch_size = 10
        total_urls = len(urls)
        
        for batch_start in range(0, total_urls, batch_size):
            batch_end = min(batch_start + batch_size, total_urls)
            current_batch = urls[batch_start:batch_end]
            
            logging.info(f"Processing batch {batch_start//batch_size + 1}: URLs {batch_start} to {batch_end-1}")
            await crawl_parallel(current_batch)
            
            # Add longer pause between batches
            if batch_end < total_urls:
                pause_time = 120  # 2 minutes between batches
                logging.info(f"Completed batch, pausing for {pause_time} seconds before next batch")
                await asyncio.sleep(pause_time)
        
        logging.info("Completed all batches")
        
    except Exception as e:
        logging.error(f"Error in main process: {e}", exc_info=True)

if __name__ == "__main__":
    asyncio.run(main())