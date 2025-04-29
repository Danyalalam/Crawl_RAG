from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import logging
import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

from backend.agent.agent import pydantic_ai_expert, PydanticAIDeps, init_global_supabase

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

# Initialize the app
app = FastAPI(
    title="Pydantic AI Documentation Assistant API",
    description="API for answering questions about the Pydantic AI framework",
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
        pydantic_ai_expert.deps = deps
        logging.info("Agent dependencies initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize agent dependencies: {e}")
        # Let the app start anyway, we'll check dependencies for each request

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
        conversation_id = request.conversation_id or f"conv_{os.urandom(4).hex()}"
        
        # Process the query with the agent
        logging.info(f"Processing query: {request.query} [conversation_id: {conversation_id}]")
        
        # Execute the agent
        result = await pydantic_ai_expert.run(request.query)
        
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

# Streaming version (optional)
@app.post("/ask/stream", tags=["Agent"])
async def ask_question_streaming(request: QueryRequest):
    try:
        # Check if the query is empty
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
            
        # Generate a conversation ID if none provided
        conversation_id = request.conversation_id or f"conv_{os.urandom(4).hex()}"
        
        # Log the incoming request
        logging.info(f"Processing streaming query: {request.query} [conversation_id: {conversation_id}]")
        
        async def generate():
            try:
                # Process the query with the agent
                result = await pydantic_ai_expert.run(request.query)
                
                # Extract the response
                response_text = result.data if hasattr(result, 'data') else str(result)
                
                # Send the JSON response
                yield f"data: {response_text}\n\n"
                
                # Send end of stream
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                logging.error(f"Error in stream generation: {e}")
                yield f"data: Error: {str(e)}\n\n"
        
        return StreamingResponse(
            generate(), 
            media_type="text/event-stream"
        )
            
    except Exception as e:
        logging.error(f"Error setting up streaming: {e}")
        raise HTTPException(status_code=500, detail=f"Error setting up streaming: {str(e)}")