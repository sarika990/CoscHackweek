import re
import os
from pathlib import Path
from backend.app.core.config import ALLOWED_EXTENSIONS

def allowed_file(filename: str) -> bool:
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXTENSIONS

def sanitize_filename(filename: str) -> str:
    # Get suffix and stem
    path = Path(filename)
    stem = path.stem
    ext = path.suffix.lower()
    
    # Remove any character that is not alphanumeric, dash, underscore, or space
    stem = re.sub(r'[^a-zA-Z0-9_\-\s]', '', stem)
    # Replace multiple spaces/dashes/underscores with single ones
    stem = re.sub(r'\s+', ' ', stem).strip()
    
    # Reassemble and limit length
    sanitized = f"{stem[:100]}{ext}"
    
    # Default to safe name if empty stem
    if not stem:
        import uuid
        sanitized = f"image_{uuid.uuid4().hex[:8]}{ext}"
        
    return sanitized

def format_file_size(size_in_bytes: int) -> str:
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_in_bytes < 1024.0:
            return f"{size_in_bytes:.2f} {unit}"
        size_in_bytes /= 1024.0
    return f"{size_in_bytes:.2f} TB"
