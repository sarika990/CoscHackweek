from pathlib import Path
from utils import get_logger

logger = get_logger("text_parser")

def parse_txt(file_path: Path) -> str:
    """
    Extracts text from a plain text file, handling encoding errors gracefully.
    """
    encodings = ["utf-8", "latin-1", "utf-16", "cp1252"]
    
    for encoding in encodings:
        try:
            logger.info(f"Attempting to read TXT file {file_path.name} with encoding: {encoding}")
            with open(file_path, "r", encoding=encoding, errors="replace") as f:
                content = f.read().strip()
                logger.info(f"Successfully read TXT file {file_path.name}")
                return content
        except Exception as e:
            logger.debug(f"Encoding {encoding} failed for {file_path.name}: {e}")
            
    logger.error(f"Failed to read TXT file {file_path.name} with standard encodings.")
    return ""
