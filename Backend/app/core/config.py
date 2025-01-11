from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:itseasy24@localhost:5432/postgres"
    MILVUS_HOST: str = "localhost"
    MILVUS_PORT: str = "19530"
    OLLAMA_API_URL: str = "http://localhost:11434"

settings = Settings()