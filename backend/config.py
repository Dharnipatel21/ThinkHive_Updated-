from __future__ import annotations
from pathlib import Path
from pydantic import SecretStr, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent          # .../ThinkHive/backend
ENV_PATH = BASE_DIR.parent / ".env"                  # .../ThinkHive/.env


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ThinkHive API"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False
    api_prefix: str = "/api/v1"
    cors_origins_value: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
        validation_alias="CORS_ORIGINS",
    )

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_database: str = "thinkhive"

    jwt_secret_key: str = "thinkhive-secret-change-in-production-32chars"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    qdrant_url: str | None = None
    qdrant_api_key: SecretStr | None = None
    qdrant_collection: str = "thinkhive_chunks"
    embedding_dimension: int = 1024

    groq_api_key: SecretStr | None = None
    google_api_key: SecretStr | None = None

    max_upload_size_mb: int = 25
    allowed_upload_extensions: list[str] = [".pdf", ".docx", ".txt"]

    redis_url: str = "redis://localhost:6379/0"
    log_level: str = "INFO"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_value.split(",") if origin.strip()]

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value: object) -> object:
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "production", "prod"}:
                return False
            if normalized in {"development", "dev"}:
                return True
        return value


settings = Settings()