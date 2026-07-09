import os
import fnmatch
from pathlib import Path
from typing import List, Dict, Any, Set
from config import ScannerConfig
from detector import SecretDetector
from logger import logger

class LocalScanner:
    """Recursively scans directories and files for secrets, respecting exclusions."""

    def __init__(self, config: ScannerConfig, detector: SecretDetector):
        self.config = config
        self.detector = detector
        self.total_files_scanned = 0
        self.findings: List[Dict[str, Any]] = []
        self.ignored_patterns: Set[str] = set()

    def load_gitignore(self, root_dir: Path) -> None:
        """Loads ignore patterns from .gitignore file if present."""
        gitignore_path = root_dir / ".gitignore"
        if gitignore_path.exists():
            try:
                with open(gitignore_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#"):
                            # Normalize path separators
                            line = line.replace("\\", "/")
                            # If it ends with a slash, match folders
                            if line.endswith("/"):
                                line = line[:-1]
                            self.ignored_patterns.add(line)
                logger.info(f"Loaded gitignore patterns from {gitignore_path}")
            except Exception as e:
                logger.error(f"Failed to read .gitignore: {e}")

    def should_ignore(self, path: Path, root_dir: Path) -> bool:
        """Determines if a file or directory should be ignored during scanning."""
        rel_path = path.relative_to(root_dir)
        parts = rel_path.parts
        
        # Check standard config ignored folders
        for folder in self.config.ignored_folders:
            if folder in parts:
                return True

        # Check standard config ignored files
        if path.name in self.config.ignored_files:
            return True

        # Check allowed extensions (only for files)
        if not path.is_dir() and self.config.allowed_extensions:
            if path.suffix.lower() not in self.config.allowed_extensions:
                return True

        # Check gitignore patterns
        path_str = str(rel_path).replace("\\", "/")
        for pattern in self.ignored_patterns:
            if fnmatch.fnmatch(path_str, pattern) or fnmatch.fnmatch(path_name := path.name, pattern):
                return True
            for part in parts:
                if fnmatch.fnmatch(part, pattern):
                    return True

        return False

    def scan_file(self, file_path: Path, root_dir: Path) -> List[Dict[str, Any]]:
        """Scans a single file line-by-line for secrets."""
        file_findings: List[Dict[str, Any]] = []
        
        # Skip directories
        if not file_path.is_file():
            return file_findings

        # Skip files that are likely binary by checking for null bytes
        try:
            with open(file_path, "rb") as f:
                chunk = f.read(1024)
                if b"\x00" in chunk:
                    logger.debug(f"Skipped binary file: {file_path}")
                    return file_findings
        except Exception as e:
            logger.debug(f"Error reading file headers for binary check on {file_path}: {e}")
            return file_findings

        # Check file size (skip files larger than 10MB to avoid memory/performance issues)
        try:
            if file_path.stat().st_size > 10 * 1024 * 1024:
                logger.warning(f"Skipped large file: {file_path}")
                return file_findings
        except Exception as e:
            logger.error(f"Error checking file size for {file_path}: {e}")
            return file_findings

        # Scan line by line
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_idx, line in enumerate(f, 1):
                    line_findings = self.detector.scan_line(line, line_idx)
                    for finding in line_findings:
                        finding.update({
                            "file_name": file_path.name,
                            "absolute_path": str(file_path.resolve()),
                            "relative_path": str(file_path.relative_to(root_dir))
                        })
                        file_findings.append(finding)
        except PermissionError:
            logger.error(f"Permission denied accessing file: {file_path}")
        except Exception as e:
            logger.error(f"Error scanning file {file_path}: {e}")

        return file_findings

    def scan_directory(self, directory: Path) -> List[Dict[str, Any]]:
        """Recursively scans a directory for secrets."""
        self.findings = []
        self.total_files_scanned = 0
        
        if not directory.exists() or not directory.is_dir():
            logger.error(f"Invalid directory path: {directory}")
            return self.findings

        # Load gitignore exclusions in the directory root
        self.load_gitignore(directory)

        for root, dirs, files in os.walk(directory, topdown=True):
            root_path = Path(root)
            
            # Prune directories in-place to prevent traversing ignored folders
            dirs[:] = [
                d for d in dirs 
                if not self.should_ignore(root_path / d, directory)
            ]

            for file in files:
                file_path = root_path / file
                if self.should_ignore(file_path, directory):
                    continue

                self.total_files_scanned += 1
                logger.info(f"Scanning file: {file_path}")
                file_findings = self.scan_file(file_path, directory)
                self.findings.extend(file_findings)

        return self.findings
