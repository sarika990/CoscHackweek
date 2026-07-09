import sys
import subprocess
from pathlib import Path
from config import ScannerConfig
from detector import SecretDetector
from local_scanner import LocalScanner
from report_generator import ReportGenerator
import time

def get_staged_files() -> list[Path]:
    """Gets the list of staged files using git command-line tool."""
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM"],
            capture_output=True,
            text=True,
            check=True
        )
        files = result.stdout.strip().split("\n")
        return [Path(f) for f in files if f]
    except subprocess.CalledProcessError:
        return []

def main() -> None:
    staged_files = get_staged_files()
    if not staged_files:
        sys.exit(0)

    config = ScannerConfig()
    detector = SecretDetector(config)
    scanner = LocalScanner(config, detector)

    findings = []
    start_time = time.time()

    for file_path in staged_files:
        if scanner.should_ignore(file_path, Path(".")):
            continue
        file_findings = scanner.scan_file(file_path, Path("."))
        findings.extend(file_findings)

    if findings:
        duration = time.time() - start_time
        # Print findings
        print("\n" + "=" * 50)
        print("!!! SECRET DETECTED - COMMIT BLOCKED !!!")
        print("=" * 50)
        for f in findings:
            print(f"File:       {f['relative_path']}")
            print(f"Line:       {f['line_number']}")
            print(f"Type:       {f['secret_type']}")
            print(f"Severity:   {f['severity_level']}")
            print(f"Masked:     {f['masked_value']}")
            print("-" * 50)
            
        print("\nGenerating report...")
        report_gen = ReportGenerator(findings, len(staged_files), duration)
        report_gen.generate_all()
        print("Please remove the sensitive information before committing.")
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
