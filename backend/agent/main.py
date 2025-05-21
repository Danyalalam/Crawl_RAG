import asyncio
import sys
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Add project root to path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_root)

from backend.agent.agent import hbl_expert, PydanticAIDeps, init_global_supabase

from backend.config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY

# Load environment variables
load_dotenv()

# Create logs directory if it doesn't exist
log_dir = Path(project_root) / "logs"
log_dir.mkdir(exist_ok=True)
log_file = log_dir / "agent.log"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(str(log_file)),
        logging.StreamHandler()
    ]
)

async def main():
    """Main function to run the agent."""
    try:
        # Make sure GEMINI_API_KEY is set - this is needed for the Gemini model
        if not os.environ.get("GEMINI_API_KEY"):
            raise ValueError("GEMINI_API_KEY environment variable is not set")
            
        # Initialize the global Supabase client
        print("Initializing Supabase client...")
        supabase = init_global_supabase()
        
        if not supabase:
            raise ValueError("Failed to initialize Supabase client")
        
        # Create dependencies
        deps = PydanticAIDeps(supabase=supabase)
        
        # Set dependencies on the agent directly
        hbl_expert.deps = deps

        
        # Print welcome message
        print("\n===== HBL Microfinance Bank Assistant =====")
        print("Ask questions about HBL Microfinance Bank's products and services.")
        print("Type 'exit' to quit.")
        print("===============================================\n")
        
        # Main interaction loop
        while True:
            # Get user input
            user_query = input("\nYour question: ")
            
            if user_query.lower() in ('exit', 'quit'):
                print("Goodbye!")
                break
            
            try:
                print("Fetching answer...")
                
                # Run the agent with ONLY the query (no deps parameter)
                result = await hbl_expert.run(user_query)
                
                # Based on the debug output, we can see the response is in result.data
                response_text = result.data if hasattr(result, 'data') else str(result)
                
                # Print the response
                print("\nAssistant:", response_text)
                
            except Exception as e:
                logging.error(f"Error running agent: {e}", exc_info=True)
                print(f"\nSorry, I encountered an error: {e}")
                print("Please try again.")
                
    except Exception as e:
        logging.error(f"Error initializing agent: {e}", exc_info=True)
        print(f"Failed to initialize the agent: {e}")

if __name__ == "__main__":
    asyncio.run(main())