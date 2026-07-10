from typing import List, Dict, Any

# In-memory storage for uploaded images
# Each item: {
#   "id": str,
#   "filename": str,
#   "size": int,
#   "formatted_size": str,
#   "resolution": str,
#   "upload_time": str,
#   "hashes": { "aHash": str, "dHash": str, "pHash": str, "wHash": str },
#   "filepath": str
# }
uploaded_images: List[Dict[str, Any]] = []

def clear_all_state():
    global uploaded_images
    uploaded_images.clear()
