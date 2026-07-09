import os
import shutil
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional
import git
from config import ScannerConfig
from detector import SecretDetector
from local_scanner import LocalScanner
from logger import logger

class GitHubScanner:
    """Clones a GitHub repository temporarily and scans it for secrets."""

    def __init__(self, config: ScannerConfig, detector: SecretDetector):
        self.config = config
        self.detector = detector
        self.local_scanner = LocalScanner(config, detector)

    def scan_repository(self, repo_url: str, token: Optional[str] = None) -> List[Dict[str, Any]]:
        """Clones and scans a GitHub repository. Cleans up cloned files afterwards."""
        findings: List[Dict[str, Any]] = []
        
        # Prepare URL with optional access token for private repos
        if token and repo_url.startswith("https://"):
            clone_url = repo_url.replace("https://", f"https://{token}@")
        else:
            clone_url = repo_url

        temp_dir = tempfile.mkdtemp(prefix="secret_scanner_git_")
        logger.info(f"Cloning {repo_url} to temporary directory {temp_dir}...")
        
        try:
            # Clone repository
            git.Repo.clone_from(clone_url, temp_dir, depth=1)
            logger.info("Clone completed successfully. Initiating scan...")
            
            # Perform directory scan
            findings = self.local_scanner.scan_directory(Path(temp_dir))
            
            # Map temp paths back to GitHub URL format
            for finding in findings:
                rel_path = finding["relative_path"]
                # Convert path separators to forward slashes for URLs
                web_path = rel_path.replace("\\", "/")
                finding["github_url"] = f"{repo_url.rstrip('/')}/blob/main/{web_path}#L{finding['line_number']}"
                
        except git.exc.GitCommandError as e:
            logger.error(f"Git clone error: {e}")
            raise RuntimeError(f"Failed to clone repository: {e.stderr.strip() if hasattr(e, 'stderr') else str(e)}")
        except Exception as e:
            logger.error(f"Error scanning GitHub repository: {e}")
            raise e
        finally:
            # Clean up temp folder
            logger.info(f"Cleaning up temporary directory {temp_dir}")
            # Use retry loop in case file is locked by git operations
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception as cleanup_err:
                logger.warning(f"Error cleaning up temp directory {temp_dir}: {cleanup_err}")

        return findings
