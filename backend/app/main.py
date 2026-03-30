from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.api.routers import ideas, experts, dashboard, onboarding

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Le Sage AI API backend"
)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow frontend to connect
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://lesage-ai.vercel.app", # Add production URL later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas.router, prefix="/api/ideas", tags=["ideas"])
app.include_router(experts.router, prefix="/api/experts", tags=["experts"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["onboarding"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Le Sage AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
