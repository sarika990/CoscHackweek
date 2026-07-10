import csv
import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_csv_report(results: List[Dict[str, Any]], filepath: str) -> str:
    """
    Generates a CSV report of comparisons.
    """
    fields = [
        "image_a_name", "image_b_name", "similarity", 
        "hamming_distance", "algorithm", "match_level", "status", "timestamp"
    ]
    
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for res in results:
            writer.writerow({
                "image_a_name": res.get("image_a_name"),
                "image_b_name": res.get("image_b_name"),
                "similarity": f"{res.get('similarity')}%",
                "hamming_distance": res.get("hamming_distance"),
                "algorithm": res.get("algorithm"),
                "match_level": res.get("match_level"),
                "status": res.get("status"),
                "timestamp": datetime.now().isoformat()
            })
    return filepath

def generate_json_report(results: List[Dict[str, Any]], filepath: str) -> str:
    """
    Generates a JSON report of comparisons.
    """
    report_data = {
        "generated_at": datetime.now().isoformat(),
        "total_comparisons": len(results),
        "results": [
            {
                "image_a_name": res.get("image_a_name"),
                "image_b_name": res.get("image_b_name"),
                "similarity": res.get("similarity"),
                "hamming_distance": res.get("hamming_distance"),
                "algorithm": res.get("algorithm"),
                "match_level": res.get("match_level"),
                "status": res.get("status"),
                "timestamp": datetime.now().isoformat()
            }
            for res in results
        ]
    }
    
    with open(filepath, mode="w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=4)
    return filepath

def generate_pdf_report(results: List[Dict[str, Any]], filepath: str) -> str:
    """
    Generates a professional PDF report using reportlab.
    """
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=12
    )
    
    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748b"),
        spaceAfter=20
    )
    
    # Title & Metadata
    story.append(Paragraph("Duplicate & Similar Image Detection Report", title_style))
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", meta_style))
    story.append(Spacer(1, 10))
    
    # Table headers
    data = [["Image A", "Image B", "Similarity", "Hamming Dist", "Algorithm", "Match Level"]]
    
    # Sort results by similarity descending
    sorted_results = sorted(results, key=lambda x: x.get('similarity', 0), reverse=True)
    
    for res in sorted_results[:100]:  # Limit to top 100 for PDF readability
        data.append([
            res.get("image_a_name")[:25] + ("..." if len(res.get("image_a_name", "")) > 25 else ""),
            res.get("image_b_name")[:25] + ("..." if len(res.get("image_b_name", "")) > 25 else ""),
            f"{res.get('similarity')}%",
            str(res.get("hamming_distance")),
            res.get("algorithm"),
            res.get("match_level")
        ])
        
    if len(results) > 100:
        data.append([f"And {len(results) - 100} more comparisons...", "", "", "", "", ""])

    t = Table(data, colWidths=[130, 130, 70, 70, 70, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#f8fafc")),
    ]))
    
    story.append(t)
    doc.build(story)
    return filepath
