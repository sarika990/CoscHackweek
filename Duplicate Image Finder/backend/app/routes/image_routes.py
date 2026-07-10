from fastapi import APIRouter, UploadFile, File, HTTPException, Query, BackgroundTasks
from typing import List, Dict, Any, Optional
import os
import shutil
import uuid
from datetime import datetime
from pathlib import Path

from backend.app.core.config import UPLOADS_DIR, MAX_FILE_SIZE
from backend.app.core.state import uploaded_images, clear_all_state
from backend.app.utils.file_utils import allowed_file, sanitize_filename, format_file_size
from backend.app.services.hash_service import compute_all_hashes, calculate_similarity, get_match_level
from backend.app.schemas.schemas import ImageInfo, SimilarityResult, StatisticsResponse

router = APIRouter()

@router.post("/upload", response_model=ImageInfo)
async def upload_image(file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.")
    
    # Read file content safely
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
        
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB.")
    
    # Generate unique ID and sanitize filename
    original_name = file.filename
    sanitized_name = sanitize_filename(original_name)
    
    # Check for duplicate filenames
    if any(img["filename"] == sanitized_name for img in uploaded_images):
        raise HTTPException(status_code=400, detail=f"An image with the filename '{sanitized_name}' has already been uploaded.")
    
    img_id = uuid.uuid4().hex[:12]
    # Save file
    file_path = UPLOADS_DIR / f"{img_id}_{sanitized_name}"
    with open(file_path, "wb") as f:
        f.write(contents)
        
    try:
        # Compute hashes and resolution
        hashes, resolution = compute_all_hashes(str(file_path))
        
        # Build response/state object
        image_record = {
            "id": img_id,
            "filename": sanitized_name,
            "size": len(contents),
            "formatted_size": format_file_size(len(contents)),
            "resolution": resolution,
            "upload_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "hashes": hashes,
            "filepath": str(file_path)
        }
        
        uploaded_images.append(image_record)
        return ImageInfo(**image_record)
        
    except Exception as e:
        # Clean up file if processing failed
        if file_path.exists():
            try:
                os.remove(file_path)
            except Exception:
                pass
        raise HTTPException(status_code=400, detail=f"Invalid or corrupted image: {str(e)}")

@router.get("/images", response_model=List[ImageInfo])
def get_images():
    return [ImageInfo(**img) for img in uploaded_images]

@router.get("/results", response_model=List[SimilarityResult])
def get_results(algorithm: str = Query("pHash", regex="^(pHash|aHash|dHash|wHash)$")):
    results = []
    n = len(uploaded_images)
    if n < 2:
        return results
        
    for i in range(n):
        for j in range(i + 1, n):
            img_a = uploaded_images[i]
            img_b = uploaded_images[j]
            
            hash_a = img_a["hashes"].get(algorithm)
            hash_b = img_b["hashes"].get(algorithm)
            
            if not hash_a or not hash_b:
                continue
                
            similarity, hamming_dist = calculate_similarity(hash_a, hash_b)
            match_lvl = get_match_level(similarity)
            
            # Determine status
            if similarity >= 100.0:
                status = "Duplicate"
            elif similarity >= 70.0:
                status = "Similar"
            else:
                status = "Unique"
                
            results.append(SimilarityResult(
                id=f"{img_a['id']}_{img_b['id']}",
                image_a_id=img_a["id"],
                image_a_name=img_a["filename"],
                image_b_id=img_b["id"],
                image_b_name=img_b["filename"],
                similarity=similarity,
                hamming_distance=hamming_dist,
                algorithm=algorithm,
                match_level=match_lvl,
                status=status
            ))
            
    return results

@router.get("/statistics", response_model=StatisticsResponse)
def get_statistics(algorithm: str = Query("pHash", regex="^(pHash|aHash|dHash|wHash)$")):
    total = len(uploaded_images)
    if total == 0:
        return StatisticsResponse(
            total_images=0,
            duplicate_images=0,
            similar_images=0,
            unique_images=0,
            selected_algorithm=algorithm,
            avg_similarity=0.0,
            highest_similarity=0.0,
            lowest_similarity=0.0
        )
        
    # Get all results to calculate similarity stats
    results = get_results(algorithm)
    
    # Calculate duplicates, similar, and unique counts per image
    duplicates_set = set()
    similarities_by_image = {img["id"]: [] for img in uploaded_images}
    
    for r in results:
        similarities_by_image[r.image_a_id].append(r.similarity)
        similarities_by_image[r.image_b_id].append(r.similarity)
        if r.similarity >= 100.0:
            duplicates_set.add(r.image_a_id)
            duplicates_set.add(r.image_b_id)
            
    duplicate_count = len(duplicates_set)
    similar_count = 0
    unique_count = 0
    
    for img_id, sims in similarities_by_image.items():
        if img_id in duplicates_set:
            continue
        max_sim = max(sims) if sims else 0.0
        if max_sim >= 70.0:
            similar_count += 1
        else:
            unique_count += 1
            
    avg_sim = 0.0
    highest = 0.0
    lowest = 100.0
    
    if results:
        avg_sim = round(sum(r.similarity for r in results) / len(results), 2)
        highest = max(r.similarity for r in results)
        lowest = min(r.similarity for r in results)
    else:
        lowest = 0.0
        
    return StatisticsResponse(
        total_images=total,
        duplicate_images=duplicate_count,
        similar_images=similar_count,
        unique_images=unique_count,
        selected_algorithm=algorithm,
        avg_similarity=avg_sim,
        highest_similarity=highest,
        lowest_similarity=lowest
    )

@router.delete("/images")
def delete_all_images():
    # Remove files physically
    for img in uploaded_images:
        path = Path(img["filepath"])
        if path.exists():
            try:
                os.remove(path)
            except Exception:
                pass
    clear_all_state()
    return {"message": "All images successfully deleted."}

@router.delete("/results")
def delete_all_results():
    # Since results are on-the-fly, this is just a success response or we can clear state
    # Let's keep it matching the delete API requirement
    return {"message": "Results cleared."}
