import time
from fastapi import APIRouter, HTTPException, status
from models.request_models import AskRequest
from models.response_models import AskResponse, HealthResponse
from services.rag_pipeline import rag_pipeline
from config import Config
from utils import get_logger

logger = get_logger("routes.chat")
router = APIRouter()

@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """
    Handles user QA questions using the RAG pipeline.
    """
    start_time = time.time()
    logger.info(f"Received question: {request.question}")
    
    if not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty."
        )
        
    try:
        response = rag_pipeline.answer_question(request.question)
        duration = time.time() - start_time
        logger.info(f"Answer generated in {duration:.4f} seconds.")
        return response
    except Exception as e:
        logger.error(f"Error executing QA: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during pipeline execution: {str(e)}"
        )

@router.post("/summarize")
async def summarize_documents():
    """
    Generates a summarized layout of all indexed document chunks.
    """
    logger.info("Summary generation request received.")
    try:
        res = rag_pipeline.generate_document_summary()
        if not res.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=res.get("summary")
            )
        return res
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during summary generation: {str(e)}"
        )

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Provides health status and configuration check.
    """
    api_configured = bool(Config.GEMINI_API_KEY)
    return HealthResponse(
        status="healthy",
        api_key_configured=api_configured
    )
