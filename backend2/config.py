from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # database related
    db_url: str
    
    # JWT Token Related
    secret_key: str
    refresh_secret_key: str
    algorithm: str
    timeout: int
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_MINUTES: int

    # internal env
    adminapikey: str

    SERVER: str

    class Config:
        env_file = Path(Path(__file__).resolve().parent) / ".env"

setting = Settings()