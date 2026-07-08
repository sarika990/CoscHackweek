import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.settings import settings
from app.routes.tasks import router as tasks_router

app = FastAPI(
    title="BrowserPilot AI API",
    description="Backend API for managing AI-driven browser automation tasks",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict to frontend host if required
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include task runner routes
app.include_router(tasks_router)

# Mount static files to serve task outputs/screenshots
screenshots_path = os.path.join(settings.DATA_DIR, "screenshots")
downloads_path = os.path.join(settings.DATA_DIR, "downloads")

os.makedirs(screenshots_path, exist_ok=True)
os.makedirs(downloads_path, exist_ok=True)

app.mount("/static/screenshots", StaticFiles(directory=screenshots_path), name="screenshots")
app.mount("/static/downloads", StaticFiles(directory=downloads_path), name="downloads")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BrowserPilot AI Engine",
        "ai_enabled": settings.GEMINI_API_KEY != ""
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
