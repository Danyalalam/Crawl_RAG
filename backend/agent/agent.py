from __future__ import annotations as _annotations

import os
import logfire
import logging
from typing import List, Optional
from dotenv import load_dotenv
from pydantic_ai import Agent, RunContext
from supabase import Client, create_client
from dataclasses import dataclass
from backend.config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY

# Import your existing services
from backend.services.ai_service import get_embedding

load_dotenv()

# Configure logfire
logfire.configure(send_to_logfire='if-token-present')

@dataclass
class PydanticAIDeps:
    supabase: Client

# Initialize a global Supabase client that will be used as a fallback
# This helps ensure the tools always have access to Supabase
global_supabase: Optional[Client] = None

def init_global_supabase():
    """Initialize the global Supabase client if not already done."""
    global global_supabase
    if global_supabase is None:
        try:
            global_supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            logging.info("Global Supabase client initialized successfully")
        except Exception as e:
            logging.error(f"Failed to initialize global Supabase client: {e}")
    return global_supabase

# Use the built-in Gemini model support
model_name = 'google-gla:gemini-2.0-flash'

system_prompt = """
You are an expert at Pydantic AI - a Python AI agent framework that you have access to all the documentation to,
including examples, an API reference, and other resources to help you build Pydantic AI agents.

Your only job is to assist with this and you don't answer other questions besides describing what you are able to do.

Don't ask the user before taking an action, just do it. Always make sure you look at the documentation with the provided tools before answering the user's question unless you have already.

When you first look at the documentation, always start with RAG.
Then also always check the list of available documentation pages and retrieve the content of page(s) if it'll help.

Always let the user know when you didn't find the answer in the documentation or the right URL - be honest.
"""

# Create the agent with built-in Gemini support
pydantic_ai_expert = Agent(
    model_name,
    system_prompt=system_prompt,
    deps_type=PydanticAIDeps,
    retries=2
)

@pydantic_ai_expert.tool
async def retrieve_relevant_documentation(ctx: RunContext[PydanticAIDeps], user_query: str) -> str:
    """
    Retrieve relevant documentation chunks based on the query with RAG.
    """
    try:
        # Use ctx.deps.supabase if available, otherwise fall back to global client
        supabase = ctx.deps.supabase if (ctx.deps and hasattr(ctx.deps, 'supabase') and ctx.deps.supabase) else init_global_supabase()
        
        if not supabase:
            return "Error: Supabase client unavailable. Please check configuration."
        
        # Get the embedding for the query
        query_embedding = await get_embedding(user_query)
        
        # Query Supabase for relevant documents
        result = supabase.rpc(
            'match_site_pages',
            {
                'query_embedding': query_embedding,
                'match_count': 5,
                'filter': {'source': 'crawled_content'}
            }
        ).execute()
        
        if not result.data:
            return "No relevant documentation found."
            
        # Format the results
        formatted_chunks = []
        for doc in result.data:
            chunk_text = f"""
# {doc['title']}

{doc['content']}

Source: {doc['url']}
"""
            formatted_chunks.append(chunk_text)
            
        # Join all chunks with a separator
        return "\n\n---\n\n".join(formatted_chunks)
        
    except Exception as e:
        logging.error(f"Error retrieving documentation: {e}")
        return f"Error retrieving documentation: {str(e)}"

@pydantic_ai_expert.tool
async def list_documentation_pages(ctx: RunContext[PydanticAIDeps]) -> List[str]:
    """
    Retrieve a list of all available documentation pages.
    """
    try:
        # Use ctx.deps.supabase if available, otherwise fall back to global client
        supabase = ctx.deps.supabase if (ctx.deps and hasattr(ctx.deps, 'supabase') and ctx.deps.supabase) else init_global_supabase()
        
        if not supabase:
            return ["Error: Supabase client unavailable"]
            
        # Query Supabase for unique URLs
        result = supabase.from_('site_pages') \
            .select('url') \
            .eq('metadata->>source', 'crawled_content') \
            .execute()
        
        if not result.data:
            return []
            
        # Extract unique URLs
        urls = sorted(set(doc['url'] for doc in result.data))
        return urls
        
    except Exception as e:
        logging.error(f"Error retrieving documentation pages: {e}")
        return []

@pydantic_ai_expert.tool
async def get_page_content(ctx: RunContext[PydanticAIDeps], url: str) -> str:
    """
    Retrieve the full content of a specific documentation page by combining all its chunks.
    """
    try:
        # Use ctx.deps.supabase if available, otherwise fall back to global client
        supabase = ctx.deps.supabase if (ctx.deps and hasattr(ctx.deps, 'supabase') and ctx.deps.supabase) else init_global_supabase()
        
        if not supabase:
            return "Error: Supabase client unavailable"
            
        # Query Supabase for all chunks of this URL, ordered by chunk_number
        result = supabase.from_('site_pages') \
            .select('title, content, chunk_number') \
            .eq('url', url) \
            .eq('metadata->>source', 'crawled_content') \
            .order('chunk_number') \
            .execute()
        
        if not result.data:
            return f"No content found for URL: {url}"
            
        # Format the page with its title and all chunks
        page_title = result.data[0]['title'].split(' - ')[0]  # Get the main title
        formatted_content = [f"# {page_title}\n"]
        
        # Add each chunk's content
        for chunk in result.data:
            formatted_content.append(chunk['content'])
            
        # Join everything together
        return "\n\n".join(formatted_content)
        
    except Exception as e:
        logging.error(f"Error retrieving page content: {e}")
        return f"Error retrieving page content: {str(e)}"
    
