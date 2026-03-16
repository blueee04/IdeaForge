# Le Sage Backend README

## Getting Started

1. Set up your environment variables:
`cp .env.example .env`

2. Fill in the `.env` file with:
   - Supabase URL & Service Role Key
   - Hugging Face Token (if `LLM_PROVIDER=huggingface`)
   
## Running the Backend

### Option 1: Docker (Recommended, especially for Windows)
Running heavy AI libraries like CrewAI on Windows can cause C++ build tool errors when installing packages like `tiktoken` or `regex`. Using Docker bypasses these issues completely.

From the project root directory:
```bash
docker-compose up backend --build
```
The API will be available at `http://localhost:8000`.

### Option 2: Local Python Env (Mac/Linux)
3. Install dependencies:
`pip install -r requirements.txt`

4. Run the development server:
`uvicorn app.main:app --reload`

5. Visit the Swagger UI for testing:
`http://127.0.0.1:8000/docs`

## Technical Stack
- **FastAPI**: Main web framework
- **CrewAI**: Agent orchestration (Researcher & Analyst)
- **Supabase**: PostgreSQL Database with REST API
- **Ollama / HuggingFace**: LLM Providers

Ensure your Ollama local server is running `llama3.2` if you choose `LLM_PROVIDER=ollama`. 
Otherwise, configure `huggingface/mistralai/Mistral-7B-Instruct-v0.2` via `LLM_PROVIDER=huggingface`.
