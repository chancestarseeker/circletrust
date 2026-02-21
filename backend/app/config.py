"""
Application settings loaded from environment variables.

Uses pydantic-settings so values can come from a .env file or the shell
environment.  Copy .env.example → .env and fill in real values.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    db_name: str = "circletrust"

    # Firebase
    firebase_credentials_path: str = "./firebase-service-account.json"

    # CORS
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        """Split the comma-separated CORS_ORIGINS string into a list."""
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
