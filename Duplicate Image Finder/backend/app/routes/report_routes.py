from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import FileResponse
import uuid
from pathlib import Path
from datetime import datetime

from backend.app.core.config import REPORTS_DIR
from backend.app.routes.image_routes import get_results
from backend.app.services.report_service import generate_csv_report, generate_json_report, generate_pdf_report

router = APIRouter()

@router.get("/report/csv")
def export_csv(algorithm: str = Query("pHash", regex="^(pHash|aHash|dHash|wHash)$")):
    results = get_results(algorithm)
    # Convert list of Pydantic models to dicts
    dict_results = [res.model_dump() for res in results]
    
    file_id = uuid.uuid4().hex[:8]
    filepath = REPORTS_DIR / f"report_{algorithm}_{file_id}.csv"
    
    try:
        generate_csv_report(dict_results, str(filepath))
        return FileResponse(
            path=filepath,
            filename=f"image_similarity_report_{algorithm}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            media_type="text/csv"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate CSV: {str(e)}")

@router.get("/report/json")
def export_json(algorithm: str = Query("pHash", regex="^(pHash|aHash|dHash|wHash)$")):
    results = get_results(algorithm)
    dict_results = [res.model_dump() for res in results]
    
    file_id = uuid.uuid4().hex[:8]
    filepath = REPORTS_DIR / f"report_{algorithm}_{file_id}.json"
    
    try:
        generate_json_report(dict_results, str(filepath))
        return FileResponse(
            path=filepath,
            filename=f"image_similarity_report_{algorithm}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            media_type="application/json"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate JSON: {str(e)}")

@router.get("/report/pdf")
def export_pdf(algorithm: str = Query("pHash", regex="^(pHash|aHash|dHash|wHash)$")):
    results = get_results(algorithm)
    dict_results = [res.model_dump() for res in results]
    
    file_id = uuid.uuid4().hex[:8]
    filepath = REPORTS_DIR / f"report_{algorithm}_{file_id}.pdf"
    
    try:
        generate_pdf_report(dict_results, str(filepath))
        return FileResponse(
            path=filepath,
            filename=f"image_similarity_report_{algorithm}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
