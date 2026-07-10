import fitz  # PyMuPDF
import pdfplumber
import pypdf
from pathlib import Path
from utils import get_logger

logger = get_logger("pdf_parser")

def parse_pdf(file_path: Path) -> str:
    """
    Extracts text from a PDF file using PyMuPDF, with fallbacks to pdfplumber and pypdf.
    Ensures the process never crashes on malformed PDFs.
    """
    text_content = []
    
    # Method 1: PyMuPDF (fitz)
    try:
        logger.info(f"Attempting PyMuPDF text extraction for {file_path.name}")
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text()
            if page_text.strip():
                text_content.append(page_text)
        
        extracted_text = "\n".join(text_content).strip()
        if extracted_text:
            logger.info(f"Successfully extracted text with PyMuPDF for {file_path.name}")
            return extracted_text
            
    except Exception as e:
        logger.error(f"PyMuPDF failed on {file_path.name}: {e}. Retrying with pdfplumber.")
        
    # Method 2: pdfplumber fallback
    try:
        logger.info(f"Attempting pdfplumber fallback extraction for {file_path.name}")
        text_content = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_content.append(page_text)
                    
        extracted_text = "\n".join(text_content).strip()
        if extracted_text:
            logger.info(f"Successfully extracted text with pdfplumber fallback for {file_path.name}")
            return extracted_text
            
    except Exception as e:
        logger.error(f"pdfplumber fallback also failed on {file_path.name}: {e}. Retrying with pypdf.")

    # Method 3: pypdf fallback
    try:
        logger.info(f"Attempting pypdf fallback extraction for {file_path.name}")
        text_content = []
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text and page_text.strip():
                text_content.append(page_text)
                
        extracted_text = "\n".join(text_content).strip()
        if extracted_text:
            logger.info(f"Successfully extracted text with pypdf fallback for {file_path.name}")
            return extracted_text
            
    except Exception as e:
        logger.error(f"pypdf fallback also failed on {file_path.name}: {e}")
        
    logger.warning(f"Could not extract any readable text from PDF: {file_path.name}")
    return ""
