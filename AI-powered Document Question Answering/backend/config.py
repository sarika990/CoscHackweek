import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    
    # Directories
    UPLOAD_DIR = BASE_DIR / "uploads"
    VECTOR_DIR = BASE_DIR / "vectors"
    LOG_DIR = BASE_DIR / "logs"
    
    # Ensure directories exist
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    VECTOR_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    
    # Model configs
    EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
    CHUNK_SIZE = 800
    CHUNK_OVERLAP = 150

    @classmethod
    def validate(cls):
        if not cls.GEMINI_API_KEY:
            # We can log a warning or raise an exception
            pass
