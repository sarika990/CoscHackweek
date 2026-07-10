import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.chat import router as chat_router
from config import Config
from utils import get_logger

logger = get_logger("app")

# Initialize FastAPI
app = FastAPI(
    title="Document QA System API",
    description="Backend API for AI-powered document QA system utilizing FastAPI, FAISS, and Gemini",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict to frontend address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(upload_router, tags=["Upload"])
app.include_router(chat_router, tags=["Chat"])

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Document QA Backend Server...")
    Config.validate()
    if not Config.GEMINI_API_KEY:
        logger.warning("WARNING: GEMINI_API_KEY is not set. The LLM QA features will fail until it is provided in your environment.")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Document QA Backend Server...")

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app:app", host=host, port=port, reload=True)
