from PIL import Image
import imagehash
import os
from pathlib import Path
from typing import Dict, Tuple

def compute_all_hashes(image_path: str) -> Tuple[Dict[str, str], str]:
    """
    Computes aHash, dHash, pHash, and wHash for the given image.
    Returns a dictionary of hashes as hex strings and the resolution string.
    """
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            resolution = f"{width}x{height}"
            
            # Ensure the image is in RGB/RGBA/L before hashing
            # ImageHash library handles conversions internally but PIL image needs to be open
            ahash_val = str(imagehash.average_hash(img))
            phash_val = str(imagehash.phash(img))
            dhash_val = str(imagehash.dhash(img))
            whash_val = str(imagehash.whash(img))
            
            return {
                "aHash": ahash_val,
                "dHash": dhash_val,
                "pHash": phash_val,
                "wHash": whash_val
            }, resolution
    except Exception as e:
        raise RuntimeError(f"Error computing image hashes: {str(e)}")

def calculate_similarity(hash1_hex: str, hash2_hex: str) -> Tuple[float, int]:
    """
    Compares two hex hashes using Hamming Distance.
    Returns (Similarity Percentage, Hamming Distance).
    """
    try:
        if not hash1_hex or not hash2_hex:
            return 0.0, 64
            
        h1 = imagehash.hex_to_hash(str(hash1_hex))
        h2 = imagehash.hex_to_hash(str(hash2_hex))
        
        # Hamming distance (number of differing bits)
        distance = h1 - h2
        
        # Hash length is normally 64 bits (8x8)
        hash_length = len(h1.hash) ** 2 if hasattr(h1, 'hash') else 64
        if hash_length == 0:
            hash_length = 64
            
        similarity = max(0.0, (1.0 - (distance / hash_length)) * 100.0)
        return round(similarity, 2), distance
    except Exception:
        return 0.0, 64

def get_match_level(similarity: float) -> str:
    """
    Determines match level based on similarity percentage.
    """
    if similarity >= 100.0:
        return "Duplicate Found"
    elif similarity >= 95.0:
        return "Very Similar"
    elif similarity >= 85.0:
        return "Similar"
    elif similarity >= 60.0:
        return "Partially Similar"
    else:
        return "Different"
