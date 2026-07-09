import os
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

def setup_logger(log_level: int = logging.INFO) -> logging.Logger:
    """Configures and returns the application logger."""
    logger = logging.getLogger("secret_scanner")
    if logger.handlers:
        return logger

    logger.setLevel(log_level)
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / "scanner.log"

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # File handler with rotation (1MB max, 3 backups)
    file_handler = RotatingFileHandler(
        log_file, maxBytes=1024 * 1024, backupCount=3, encoding="utf-8"
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.DEBUG)
    logger.addHandler(file_handler)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.WARNING)
    logger.addHandler(console_handler)

    return logger

logger = setup_logger()
