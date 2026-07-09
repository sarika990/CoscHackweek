import os
import json
import html
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any

class ReportGenerator:
    """Generates structured scan reports in JSON, TXT, and HTML formats."""

    def __init__(self, findings: List[Dict[str, Any]], total_files: int, duration: float):
        self.findings = findings
        self.total_files = total_files
        self.duration = duration
        self.timestamp = datetime.now().isoformat()
        
        # Ensure reports directory exists
        self.reports_dir = Path("reports")
        self.reports_dir.mkdir(exist_ok=True)

    def generate_all(self) -> Dict[str, Path]:
        """Generates JSON, TXT, and HTML report formats."""
        paths = {}
        paths["json"] = self.generate_json()
        paths["txt"] = self.generate_txt()
        paths["html"] = self.generate_html()
        return paths

    def _get_summary(self) -> Dict[str, Any]:
        """Helper to compile summary statistics of the scan findings."""
        severity_counts = {"low": 0, "medium": 0, "high": 0}
        type_counts: Dict[str, int] = {}
        unique_files = set()

        for f in self.findings:
            severity = f.get("severity_level", "medium").lower()
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
            
            sec_type = f.get("secret_type", "Unknown")
            type_counts[sec_type] = type_counts.get(sec_type, 0) + 1
            
            unique_files.add(f.get("relative_path", ""))

        return {
            "total_secrets_found": len(self.findings),
            "total_files_scanned": self.total_files,
            "unique_files_with_secrets": len(unique_files),
            "severity_summary": severity_counts,
            "secret_types_summary": type_counts,
            "scan_duration_seconds": round(self.duration, 4),
            "timestamp": self.timestamp
        }

    def generate_json(self) -> Path:
        """Generates reports/report.json."""
        report_data = {
            "summary": self._get_summary(),
            "findings": self.findings
        }
        report_path = self.reports_dir / "report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        return report_path

    def generate_txt(self) -> Path:
        """Generates reports/report.txt."""
        summary = self._get_summary()
        report_path = self.reports_dir / "report.txt"
        
        lines = [
            "==================================================",
            "           SECURITY SECRET SCAN REPORT            ",
            "==================================================",
            f"Timestamp:      {summary['timestamp']}",
            f"Files Scanned:  {summary['total_files_scanned']}",
            f"Secrets Found:  {summary['total_secrets_found']}",
            f"Scan Duration:  {summary['scan_duration_seconds']}s",
            "--------------------------------------------------",
            "SEVERITY SUMMARY:",
            f"  High:   {summary['severity_summary']['high']}",
            f"  Medium: {summary['severity_summary']['medium']}",
            f"  Low:    {summary['severity_summary']['low']}",
            "--------------------------------------------------",
            "SECRET TYPES FOUND:",
        ]
        
        for k, v in summary["secret_types_summary"].items():
            lines.append(f"  - {k}: {v}")
            
        lines.append("--------------------------------------------------")
        lines.append("FINDINGS:")
        lines.append("--------------------------------------------------")
        
        for idx, f in enumerate(self.findings, 1):
            lines.extend([
                f"Finding #{idx}",
                f"  Type:       {f.get('secret_type')}",
                f"  File:       {f.get('relative_path')}",
                f"  Line:       {f.get('line_number')}",
                f"  Confidence: {f.get('confidence_score')}",
                f"  Severity:   {f.get('severity_level')}",
                f"  Masked:     {f.get('masked_value')}",
                "--------------------------------------------------"
            ])
            
        with open(report_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
            
        return report_path

    def generate_html(self) -> Path:
        """Generates reports/report.html with an interactive dashboard styling."""
        summary = self._get_summary()
        report_path = self.reports_dir / "report.html"
        
        # HTML template
        html_head = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secret Scan Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1, h2 { color: #f1f5f9; }
        .dashboard-header { border-bottom: 2px solid #1e293b; padding-bottom: 10px; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #1e293b; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #334155; }
        .stat-card .val { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .stat-card.total { border-color: #3b82f6; color: #3b82f6; }
        .stat-card.high { border-color: #ef4444; color: #ef4444; }
        .stat-card.med { border-color: #f59e0b; color: #f59e0b; }
        .stat-card.low { border-color: #10b981; color: #10b981; }
        .findings-table { width: 100%; border-collapse: collapse; background-color: #1e293b; border-radius: 8px; overflow: hidden; border: 1px solid #334155; }
        .findings-table th, .findings-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #334155; }
        .findings-table th { background-color: #0f172a; color: #94a3b8; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; }
        .badge.high { background-color: #ef4444; color: #ffffff; }
        .badge.medium { background-color: #f59e0b; color: #ffffff; }
        .badge.low { background-color: #10b981; color: #ffffff; }
    </style>
</head>
<body>
<div class="container">
    <div class="dashboard-header">
        <h1>🛡️ Security Secret Scan Report</h1>
        <p>Generated: """ + html.escape(summary["timestamp"]) + """ | Duration: """ + str(summary["scan_duration_seconds"]) + """s</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card total">
            <div class="val">""" + str(summary["total_secrets_found"]) + """</div>
            <div>Secrets Found</div>
        </div>
        <div class="stat-card high">
            <div class="val">""" + str(summary["severity_summary"]["high"]) + """</div>
            <div>High Severity</div>
        </div>
        <div class="stat-card med">
            <div class="val">""" + str(summary["severity_summary"]["medium"]) + """</div>
            <div>Medium Severity</div>
        </div>
        <div class="stat-card low">
            <div class="val">""" + str(summary["severity_summary"]["low"]) + """</div>
            <div>Low Severity</div>
        </div>
    </div>
    
    <h2>Scan Findings</h2>
    <table class="findings-table">
        <thead>
            <tr>
                <th>Type</th>
                <th>File Path</th>
                <th>Line</th>
                <th>Confidence</th>
                <th>Severity</th>
                <th>Masked Secret</th>
            </tr>
        </thead>
        <tbody>
"""
        html_rows = []
        for f in self.findings:
            sev_class = f.get("severity_level", "medium").lower()
            html_rows.append(f"""            <tr>
                <td><strong>{html.escape(f.get('secret_type', ''))}</strong></td>
                <td>{html.escape(f.get('relative_path', ''))}</td>
                <td>{f.get('line_number', 0)}</td>
                <td><span class="badge {f.get('confidence_score', 'medium')}">{f.get('confidence_score', 'medium')}</span></td>
                <td><span class="badge {sev_class}">{sev_class}</span></td>
                <td><code>{html.escape(f.get('masked_value', ''))}</code></td>
            </tr>""")
            
        html_foot = """        </tbody>
    </table>
</div>
</body>
</html>
"""
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(html_head + "\n".join(html_rows) + html_foot)
            
        return report_path
