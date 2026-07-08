from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class TaskCreate(BaseModel):
    task: str = Field(..., description="Task description in natural language")
    headless: Optional[bool] = None

class ExecutionStep(BaseModel):
    timestamp: str
    action: str
    thought: str
    status: str  # "info", "success", "warning", "error"
    screenshot: Optional[str] = None

class TaskResult(BaseModel):
    success: bool
    summary: str
    extracted_data: Optional[Any] = None
    error_message: Optional[str] = None
    files_downloaded: List[str] = []
    screenshot: Optional[str] = None

class TaskState(BaseModel):
    id: str
    task: str
    status: str  # "pending", "running", "completed", "failed", "stopped"
    progress: int  # 0 to 100
    created_at: str
    completed_at: Optional[str] = None
    timeline: List[ExecutionStep] = []
    result: Optional[TaskResult] = None
    logs: List[str] = []

class DashboardStats(BaseModel):
    completed_tasks: int
    running_tasks: int
    failed_tasks: int
    average_time_seconds: float
    success_rate: float
    browser_status: str  # "idle", "active", "error"
    ai_status: str  # "active", "disabled"
    current_website: Optional[str] = None
