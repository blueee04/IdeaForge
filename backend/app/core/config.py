from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Le Sage AI"
    VERSION: str = "1.0.0"
    
    # Supabase Setup
    NEXT_PUBLIC_SUPABASE_URL: str = ""
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # LLM Settings (default to HuggingFace for cloud inference)
    LLM_PROVIDER: str = "huggingface"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    HF_TOKEN: str = ""  # Required for HuggingFace - get from https://huggingface.co/settings/tokens
    
    # Semantic Scholar API
    SEMANTIC_SCHOLAR_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

settings = Settings()
