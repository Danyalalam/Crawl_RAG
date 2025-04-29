from typing import List
import logging
from backend.config.settings import supabase
from backend.models.chunk import ProcessedChunk


async def insert_chunks_batch(chunks: List[ProcessedChunk]):
    """Insert multiple chunks in a single batch operation with upsert."""
    if not chunks:
        return
        
    try:
        batch_data = [{
            "url": chunk.url,
            "chunk_number": chunk.chunk_number,
            "title": chunk.title,
            "summary": chunk.summary,
            "content": chunk.content,
            "metadata": chunk.metadata,
            "embedding": chunk.embedding
        } for chunk in chunks]
        
        # Correct syntax for upsert with Supabase
        result = supabase.table("site_pages").upsert(
            batch_data,
            on_conflict="url,chunk_number"  # Use comma-separated string instead of list
        ).execute()
        
        logging.info(f"Upserted batch of {len(chunks)} chunks")
        return result
    except Exception as e:
        logging.error(f"Error batch upserting chunks: {e}")
        # Fall back to individual inserts if batch fails
        logging.info("Falling back to individual inserts")
        results = []
        for chunk in chunks:
            try:
                data = {
                    "url": chunk.url,
                    "chunk_number": chunk.chunk_number,
                    "title": chunk.title,
                    "summary": chunk.summary,
                    "content": chunk.content,
                    "metadata": chunk.metadata,
                    "embedding": chunk.embedding
                }
                # Correct syntax for individual upsert
                result = supabase.table("site_pages").upsert(
                    data,
                    on_conflict="url,chunk_number"  # Use comma-separated string
                ).execute()
                results.append(result)
            except Exception as inner_e:
                logging.error(f"Error in individual upsert: {inner_e}")
        return results