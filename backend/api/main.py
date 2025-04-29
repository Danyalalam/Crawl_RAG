import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    """Run the FastAPI application with uvicorn."""
    # Configure the server
    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    # Run the server
    uvicorn.run(
        "backend.api.service:app",
        host=host,
        port=port,
        reload=True,  # Set to False in production
        log_level="info"
    )

if __name__ == "__main__":
    main()