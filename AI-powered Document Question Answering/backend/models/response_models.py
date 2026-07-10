from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class SourceCitation(BaseModel):
    source: str
    chunk_index: int
    score: Optional[float] = None

class AskResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]

class FileInfo(BaseModel):
    filename: str
    size: int
    uploaded_at: str

class ResetResponse(BaseModel):
    status: str
    message: str

class HealthResponse(BaseModel):
    status: str
    api_key_configured: bool
