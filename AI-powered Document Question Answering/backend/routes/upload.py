import shutil
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from config import Config
from services.pdf_parser import parse_pdf
from services.text_parser import parse_txt
from services.chunking import chunk_text
from services.vector_store import vector_store_manager
from models.response_models import FileInfo, ResetResponse
from utils import get_logger

logger = get_logger("routes.upload")
router = APIRouter()

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB

def sanitize_filename(name: str) -> str:
    """Sanitizes filename to prevent directory traversal."""
    return Path(name).name

@router.post("/upload", response_model=List[FileInfo])
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Upload and index multiple PDF/TXT files.
    """
    logger.info(f"Received upload request for {len(files)} files.")
    uploaded_files_info = []
    all_new_chunks = []
    
    for upload_file in files:
        filename = sanitize_filename(upload_file.filename)
        
        # Check extension
        ext = Path(filename).suffix.lower()
        if ext not in [".pdf", ".txt"]:
            logger.warning(f"Rejected unsupported file: {filename}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format: {filename}. Only PDF and TXT are supported."
            )
            
        file_path = Config.UPLOAD_DIR / filename
        
        # Read file chunks to validate size and save
        try:
            size = 0
            with open(file_path, "wb") as f:
                while content := await upload_file.read(8192):
                    size += len(content)
                    if size > MAX_FILE_SIZE:
                        logger.warning(f"File {filename} exceeded maximum size of 20MB.")
                        f.close()
                        file_path.unlink(missing_ok=True)
                        raise HTTPException(
                            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                            detail=f"File {filename} exceeds the 20MB size limit."
                        )
                    f.write(content)
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error saving file {filename}: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not save file {filename}: {str(e)}"
            )

        # Parse text based on type
        text = ""
        try:
            if ext == ".pdf":
                text = parse_pdf(file_path)
            elif ext == ".txt":
                text = parse_txt(file_path)
        except Exception as e:
            logger.error(f"Error parsing file {filename}: {e}")
            file_path.unlink(missing_ok=True)
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Error parsing file {filename}: {str(e)}"
            )
            
        if not text.strip():
            file_path.unlink(missing_ok=True)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File {filename} contains no readable text."
            )
            
        # Chunk text
        chunks = chunk_text(text, filename, Config.CHUNK_SIZE, Config.CHUNK_OVERLAP)
        all_new_chunks.extend(chunks)
        
        # Record stats
        uploaded_files_info.append(
            FileInfo(
                filename=filename,
                size=size,
                uploaded_at=str(Path(file_path).stat().st_mtime)
            )
        )
        
    # Append new chunks to vector store
    if all_new_chunks:
        try:
            vector_store_manager.add_chunks(all_new_chunks)
        except Exception as e:
            logger.error(f"Failed to index chunks: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate embeddings and index: {str(e)}"
            )
            
    return uploaded_files_info

@router.get("/files", response_model=List[FileInfo])
async def list_files():
    """
    Lists all uploaded files.
    """
    logger.info("Listing files in upload directory.")
    files = []
    for path in Config.UPLOAD_DIR.glob("*"):
        if path.is_file() and path.name != ".gitkeep":
            stat = path.stat()
            files.append(
                FileInfo(
                    filename=path.name,
                    size=stat.st_size,
                    uploaded_at=str(stat.st_mtime)
                )
            )
    return files

@router.delete("/reset", response_model=ResetResponse)
async def reset_knowledge_base():
    """
    Resets the application: deletes all uploaded files, clears the FAISS index.
    """
    logger.info("Reset request received. Wiping uploaded files and vector store.")
    try:
        # Delete upload files
        for path in Config.UPLOAD_DIR.glob("*"):
            if path.is_file() and path.name != ".gitkeep":
                path.unlink()
                
        # Clear vector database
        vector_store_manager.clear()
        
        return ResetResponse(status="success", message="Knowledge base reset successfully.")
    except Exception as e:
        logger.error(f"Error resetting knowledge base: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error resetting knowledge base: {str(e)}"
        )
