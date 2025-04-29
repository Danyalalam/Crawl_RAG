import os
from dotenv import load_dotenv
from openai import AzureOpenAI
from google import genai
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Azure OpenAI settings
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_ENDPOINT = "https://langrag.openai.azure.com/"
AZURE_API_VERSION = "2024-02-01"
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DEPLOYMENT = "text-embedding-3-small"

# Azure rate limit settings
AZURE_TOKENS_PER_MIN_LIMIT = 120000
AZURE_REQUESTS_PER_MIN_LIMIT = 720
# Calculate safe limits (80% of max to provide buffer)
AZURE_SAFE_TOKENS_PER_MIN = int(AZURE_TOKENS_PER_MIN_LIMIT * 0.8)
AZURE_SAFE_REQUESTS_PER_MIN = int(AZURE_REQUESTS_PER_MIN_LIMIT * 0.8)

# Gemini settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"
# Gemini has much stricter limits (15 RPM, 1M TPM, 1500 RPD)
GEMINI_REQUESTS_PER_MIN_LIMIT = 15
GEMINI_TOKENS_PER_MIN_LIMIT = 50000  # Conservative estimate
# Set safe limits at 70% of max to provide buffer
GEMINI_SAFE_REQUESTS_PER_MIN = 10  # Very conservative
GEMINI_SAFE_TOKENS_PER_MIN = int(GEMINI_TOKENS_PER_MIN_LIMIT * 0.7)

# Supabase settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Initialize clients
azure_client = AzureOpenAI(
    api_version=AZURE_API_VERSION,
    azure_endpoint=AZURE_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY
)

genai_client = genai.Client(api_key=GEMINI_API_KEY)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Crawler settings
DEFAULT_MAX_CONCURRENT = 2  # Reduced to manage API rate limits better