import asyncio
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import List, Dict, Optional
import logging

from backend.models.chunk import ProcessedChunk
from backend.utils.text_utils import chunk_text
from backend.services.ai_service import get_title_and_summary, get_embedding
from backend.services.db_service import insert_chunks_batch

async def process_chunk(chunk: str, chunk_number: int, url: str) -> ProcessedChunk:
    """Process a single chunk of text."""
    try:
        # Get title and summary
        extracted = await get_title_and_summary(chunk, url)
        
        # Get embedding
        embedding = await get_embedding(chunk)
        
        # Create metadata
        metadata = {
            "source": "crawled_content",
            "chunk_size": len(chunk),
            "crawled_at": datetime.now(timezone.utc).isoformat(),
            "url_path": urlparse(url).path
        }
        
        return ProcessedChunk(
            url=url,
            chunk_number=chunk_number,
            title=extracted['title'],
            summary=extracted['summary'],
            content=chunk,  # Store the original chunk content
            metadata=metadata,
            embedding=embedding
        )
    except Exception as e:
        logging.error(f"Error processing chunk {chunk_number} for URL {url}: {e}")
        # Return a minimal valid chunk
        return ProcessedChunk(
            url=url,
            chunk_number=chunk_number,
            title="Error processing chunk",
            summary="An error occurred while processing this content",
            content=chunk[:1000],  # Store truncated content
            metadata={"error": str(e), "source": "error_recovery"},
            embedding=[0] * 1536  # Empty embedding
        )

# Modify process_and_store_document to process smaller batches

async def process_and_store_document(url: str, markdown: str, batch_size: int = 1):  # Reduced from 2 to 1
    """Process a document and store its chunks in batches."""
    if not markdown:
        logging.warning(f"Empty markdown content for URL: {url}")
        return
        
    # Split into chunks
    chunks = chunk_text(markdown)
    logging.info(f"Split document into {len(chunks)} chunks for URL: {url}")
    
    # Process chunks in smaller batches with longer delays between batches
    processed_chunks = []
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        tasks = [
            process_chunk(chunk, i+j, url) 
            for j, chunk in enumerate(batch)
        ]
        batch_results = await asyncio.gather(*tasks)
        processed_chunks.extend(batch_results)
        
        # Add a longer delay between batches
        if i + batch_size < len(chunks):
            await asyncio.sleep(30)  # Increased from 15 to 30 seconds
    
    # Store all chunks in a single batch operation
    await insert_chunks_batch(processed_chunks)
    logging.info(f"Stored {len(processed_chunks)} chunks for URL: {url}")