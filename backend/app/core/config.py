import os
from typing import Optional

from pydantic import BaseModel


class Settings(BaseModel):
    google_gemini_api_key: Optional[str] = None
    database_url: Optional[str] = None
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


def get_settings() -> Settings:
    return Settings(
        google_gemini_api_key=os.getenv("GOOGLE_GEMINI_API_KEY"),
        database_url=os.getenv("DATABASE_URL"),
        cors_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000"),
    )
