"""Application settings loaded from environment variables."""

from functools import lru_cache
from typing import Literal

from pydantic import Field, PostgresDsn, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "LeakGuard AI API"
    app_version: str = "1.0.0"
    environment: Literal["local", "staging", "production"] = "local"
    debug: bool = False

    api_v1_prefix: str = "/api/v1"

    database_url: str = Field(
        default="sqlite+aiosqlite:///./leakguard.db",
        description="Async SQLAlchemy database URL",
    )

    cors_origins: str = "http://localhost:3000"
    cors_origin_regex: str | None = r"https://.*\.vercel\.app"

    jwt_secret_key: str = Field(
        default="change-me-in-production-use-openssl-rand-hex-32",
        min_length=32,
    )
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    supabase_url: str | None = None
    supabase_jwt_secret: str | None = None

    google_gemini_api_key: str | None = None

    max_upload_bytes: int = 10 * 1024 * 1024
    rate_limit_per_minute: int = 60

    log_level: str = "INFO"

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value: bool | str | None) -> bool:
        if value is None or isinstance(value, bool):
            return bool(value)
        normalized = value.strip().lower()
        if normalized in {"1", "true", "yes", "on", "debug", "development", "local"}:
            return True
        if normalized in {"0", "false", "no", "off", "release", "production", "prod"}:
            return False
        return False

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str | PostgresDsn | None) -> str:
        if value is None:
            return "sqlite+aiosqlite:///./leakguard.db"
        url = str(value)
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg://", 1)
        elif url.startswith("postgresql://") and "+psycopg" not in url:
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        default_secret = "change-me-in-production-use-openssl-rand-hex-32"
        if self.environment == "production" and self.jwt_secret_key == default_secret:
            raise ValueError("JWT_SECRET_KEY must be changed before running in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
