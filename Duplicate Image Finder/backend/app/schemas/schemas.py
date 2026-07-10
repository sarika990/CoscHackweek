from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class ImageInfo(BaseModel):
    id: str
    filename: str
    size: int
    formatted_size: str
    resolution: str
    upload_time: str
    hashes: Dict[str, str]  # algorithm name -> hash string
    filepath: str

class SimilarityResult(BaseModel):
    id: str
    image_a_id: str
    image_a_name: str
    image_b_id: str
    image_b_name: str
    similarity: float
    hamming_distance: int
    algorithm: str
    match_level: str  # "Duplicate Found", "Very Similar", "Similar", "Partially Similar", "Different"
    status: str       # "Duplicate" or "Similar" or "Unique"

class StatisticsResponse(BaseModel):
    total_images: int
    duplicate_images: int
    similar_images: int
    unique_images: int
    selected_algorithm: str
    avg_similarity: float
    highest_similarity: float
    lowest_similarity: float
