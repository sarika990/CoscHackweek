import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    GEMINI_API_KEY: str = ""
    PLAYWRIGHT_HEADLESS: bool = True
    DATA_DIR: str = "./data"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure directories exist
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.DATA_DIR, "screenshots"), exist_ok=True)
os.makedirs(os.path.join(settings.DATA_DIR, "downloads"), exist_ok=True)
