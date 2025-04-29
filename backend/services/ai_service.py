import json
import asyncio
from typing import Dict, List, Any
import logging

from backend.config.settings import (
    azure_client, genai_client, 
    EMBEDDING_MODEL, EMBEDDING_DEPLOYMENT, GEMINI_MODEL,
    AZURE_SAFE_REQUESTS_PER_MIN, AZURE_SAFE_TOKENS_PER_MIN,
    GEMINI_SAFE_REQUESTS_PER_MIN, GEMINI_SAFE_TOKENS_PER_MIN
)
from backend.utils.rate_limiter import RateLimiter

# Initialize separate rate limiters for each service
azure_rate_limiter = RateLimiter(
    name="Azure",
    requests_per_minute=AZURE_SAFE_REQUESTS_PER_MIN,
    tokens_per_minute=AZURE_SAFE_TOKENS_PER_MIN
)

gemini_rate_limiter = RateLimiter(
    name="Gemini",
    requests_per_minute=GEMINI_SAFE_REQUESTS_PER_MIN,
    tokens_per_minute=GEMINI_SAFE_TOKENS_PER_MIN
)

async def get_title_and_summary(chunk: str, url: str) -> Dict[str, str]:
    """Extract title and summary using Gemini."""
    prompt = f"""You are an AI that extracts titles and summaries from documentation chunks.
    
    URL: {url}
    
    Content:
    {chunk[:1500]}... (content truncated for brevity)
    
    Please extract:
    1. A concise but descriptive title for this content
    2. A brief summary (2-3 sentences) of the main points
    
    Format your response as:
    Title: [extracted title]
    Summary: [brief summary]
    """
    
    # Estimate token count (rough approximation)
    estimated_tokens = len(prompt.split()) * 1.5
    
    # Wait for API capacity with the Gemini-specific rate limiter
    await gemini_rate_limiter.wait_for_capacity(int(estimated_tokens))
    
    try:
        response = genai_client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt
        )
        
        # Parse the response
        text = response.text
        title_line = next((line for line in text.split('\n') if line.startswith('Title:')), 'Title: Untitled Document')
        summary_line = next((line for line in text.split('\n') if line.startswith('Summary:')), 'Summary: No summary available')
        
        title = title_line.replace('Title:', '').strip()
        summary = summary_line.replace('Summary:', '').strip()
        
        return {"title": title, "summary": summary}
    except Exception as e:
        logging.error(f"Error getting title and summary: {e}")
        # Add retry logic with exponential backoff for rate limit errors
        if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
            logging.warning("Hit rate limit, implementing longer cooldown")
            await asyncio.sleep(60)  # Wait a full minute on rate limit error
        return {"title": "Error processing title", "summary": "Error processing summary"}

async def get_embedding(text: str) -> List[float]:
    """Get embedding vector from Azure OpenAI."""
    # Truncate text if too long (embedding models typically have limits)
    max_tokens = 8000
    text = text[:max_tokens * 4]  # Rough approximation of chars to tokens
    
    # Estimate token count
    estimated_tokens = len(text.split()) * 1.5
    
    # Wait for API capacity with the Azure-specific rate limiter
    await azure_rate_limiter.wait_for_capacity(int(estimated_tokens))
    
    try:
        response = azure_client.embeddings.create(
            input=text,
            model=EMBEDDING_DEPLOYMENT
        )
        return response.data[0].embedding
    except Exception as e:
        logging.error(f"Error getting embedding: {e}")
        # Return a vector of zeros with the correct dimensionality
        return [0] * 1536  # For text-embedding-3-small