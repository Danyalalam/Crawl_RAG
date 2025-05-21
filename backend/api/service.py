from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import logging
import asyncio
import json
import uuid
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

from backend.agent.agent import hbl_expert, PydanticAIDeps, init_global_supabase

# Load environment variables
load_dotenv()

# Configure logging
log_dir = Path(project_root) / "logs"
log_dir.mkdir(exist_ok=True)
log_file = log_dir / "api.log"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(str(log_file)),
        logging.StreamHandler()
    ]
)

# Line 41-43: Update this to match HBL
app = FastAPI(
    title="HBL MicroFinance Bank Assistant API",
    description="API for answering questions about HBL MicroFinance Bank products and services",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models for request and response
class QueryRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None

class AgentResponse(BaseModel):
    response: str
    conversation_id: str
    
class HealthResponse(BaseModel):
    status: str
    version: str

# Dependency to get Supabase client
async def get_dependencies():
    supabase = init_global_supabase()
    if not supabase:
        raise HTTPException(status_code=500, detail="Failed to initialize Supabase client")
    
    # Create dependencies
    deps = PydanticAIDeps(supabase=supabase)
    return deps

# Set up a global dependencies object on startup
@app.on_event("startup")
async def startup_db_client():
    try:
        # Initialize dependencies once on startup
        deps = await get_dependencies()
        
        # Set dependencies on the agent directly
        hbl_expert.deps = deps
        logging.info("Agent dependencies initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize agent dependencies: {e}")

# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "version": "1.0.0"
    }

# Main endpoint to ask questions
@app.post("/ask", response_model=AgentResponse, tags=["Agent"])
async def ask_question(request: QueryRequest, background_tasks: BackgroundTasks):
    try:
        # Check if the query is empty
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Generate a conversation ID if none provided
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Process the query with the agent
        logging.info(f"Processing query: {request.query} [conversation_id: {conversation_id}]")
        
        # Execute the agent
        result = await hbl_expert.run(request.query)
        
        # Extract the response
        response_text = result.data if hasattr(result, 'data') else str(result)
        
        # Log the completion
        background_tasks.add_task(
            logging.info, 
            f"Completed query: {request.query} [conversation_id: {conversation_id}]"
        )
        
        return {
            "response": response_text,
            "conversation_id": conversation_id
        }
        
    except Exception as e:
        logging.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

# Single streaming endpoint that uses the simulated streaming approach
@app.post("/stream", tags=["Agent"])
async def stream_response(request: Request):
    """
    Stream responses from the AI agent with reliable chunking.
    """
    try:
        # Parse the request body
        data = await request.json()
        query = data.get("query")
        conversation_id = data.get("conversation_id")
        
        # Validate the query
        if not query or not query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Generate a conversation ID if none provided
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
            
        # Log the incoming request
        logging.info(f"Processing streaming query: {query} [conversation_id: {conversation_id}]")
        
        async def generate():
            try:
                # Get the complete response first to avoid streaming issues
                result = await hbl_expert.run(query)
                
                # Extract the response text
                response_text = result.data if hasattr(result, 'data') else str(result)
                
                # Break response into chunks (simulate streaming)
                # Adjust the chunk size to control streaming speed
                chunk_size = 10  # Characters per chunk
                
                for i in range(0, len(response_text), chunk_size):
                    chunk = response_text[i:i+chunk_size]
                    # Send chunk as SSE event
                    yield f"data: {json.dumps({'text': chunk})}\n\n"
                    # Small delay to make streaming feel natural
                    await asyncio.sleep(0.01)
                
                # Send completion event
                yield f"data: {json.dumps({'done': True})}\n\n"
                
                # Log completion
                logging.info(f"Completed streaming query: {query} [conversation_id: {conversation_id}]")
                
            except Exception as e:
                error_msg = f"Error in stream generation: {str(e)}"
                logging.error(error_msg)
                yield f"data: {json.dumps({'error': error_msg})}\n\n"
        
        # Return a streaming response with the conversation ID in headers
        return StreamingResponse(
            generate(), 
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Conversation-ID": conversation_id
            }
        )
            
    except Exception as e:
        logging.error(f"Error setting up streaming: {e}")
        raise HTTPException(status_code=500, detail=f"Error setting up streaming: {str(e)}")