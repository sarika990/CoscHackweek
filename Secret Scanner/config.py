import os
import yaml
from pathlib import Path
from typing import List, Dict, Any
from logger import logger

DEFAULT_CONFIG_PATH = Path("config/scanner_config.yaml")

class ScannerConfig:
    """Class representing and validating the scanner configurations."""
    
    def __init__(self, config_path: Path = DEFAULT_CONFIG_PATH):
        self.config_path = config_path
        self.ignored_folders: List[str] = []
        self.ignored_files: List[str] = []
        self.allowed_extensions: List[str] = []
        self.confidence_threshold: str = "medium"
        self.enable_entropy: bool = True
        self.entropy_threshold: float = 4.5
        self.report_formats: List[str] = ["json", "txt", "html"]
        
        self.load_config()

    def load_config(self) -> None:
        """Loads configuration from YAML or applies defaults."""
        data: Dict[str, Any] = {}
        if self.config_path.exists():
            try:
                with open(self.config_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f) or {}
                logger.info(f"Loaded config from {self.config_path}")
            except Exception as e:
                logger.error(f"Error reading configuration file: {e}. Using defaults.")
        else:
            logger.warning(f"Config file not found at {self.config_path}. Using defaults.")

        self.ignored_folders = data.get("ignored_folders", [
            ".git", "node_modules", "venv", ".venv", "__pycache__", "dist", "build", "coverage"
        ])
        self.ignored_files = data.get("ignored_files", [])
        self.allowed_extensions = data.get("allowed_extensions", [])
        self.confidence_threshold = data.get("confidence_threshold", "medium").lower()
        self.enable_entropy = data.get("enable_entropy", True)
        self.entropy_threshold = float(data.get("entropy_threshold", 4.5))
        self.report_formats = data.get("report_formats", ["json", "txt", "html"])

        self.validate()

    def validate(self) -> None:
        """Validates configuration values."""
        if self.confidence_threshold not in ["low", "medium", "high"]:
            logger.warning(
                f"Invalid confidence threshold '{self.confidence_threshold}'. Defaulting to 'medium'."
            )
            self.confidence_threshold = "medium"

        if not (0.0 <= self.entropy_threshold <= 8.0):
            logger.warning(
                f"Entropy threshold {self.entropy_threshold} out of bounds (0-8). Defaulting to 4.5."
            )
            self.entropy_threshold = 4.5
            
        # Ensure all allowed extensions start with a dot
        self.allowed_extensions = [
            ext if ext.startswith(".") else f".{ext}"
            for ext in self.allowed_extensions
        ]
