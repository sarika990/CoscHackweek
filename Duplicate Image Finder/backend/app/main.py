from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from backend.app.core.config import HOST, PORT, ALLOWED_ORIGINS, UPLOADS_DIR
from backend.app.routes import image_routes, report_routes

app = FastAPI(
    title="Duplicate & Visually Similar Image Detection Tool API",
    version="1.0.0",
    description="Backend service using multiple image hashing techniques to compute similarity metrics."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory to serve images directly to the frontend
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Include routers
app.include_router(image_routes.router, tags=["Images"])
app.include_router(report_routes.router, tags=["Reports"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Duplicate & Visually Similar Image Detector API is running.",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host=HOST, port=PORT, reload=True)
