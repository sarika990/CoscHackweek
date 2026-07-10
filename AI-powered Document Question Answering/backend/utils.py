import logging
import time
from pathlib import Path
from config import Config

# Setup logging
log_file = Config.LOG_DIR / "app.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(log_file, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("doc-qa-system")

def get_logger(name: str) -> logging.Logger:
    """Returns a logger with the given name."""
    return logging.getLogger(f"doc-qa-system.{name}")

class Timer:
    """A context manager to measure execution time."""
    def __init__(self, name: str):
        self.name = name
        self.logger = get_logger("timer")

    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start
        self.logger.info(f"{self.name} took {elapsed:.4f} seconds")
