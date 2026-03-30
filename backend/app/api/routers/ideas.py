from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import IdeaRequest, Idea
from app.services.idea_service import generate_ideas_with_agents
from app.core.rate_limiter import limiter
from typing import List

router = APIRouter()

@router.post("/generate", response_model=List[Idea])
@limiter.limit("5/hour")  # Limit AI generation to 5 per hour per IP
async def generate_ideas(request: Request, idea_request: IdeaRequest):
    """
    Generate ideas based on user's field and novelty level.
    Uses CrewAI behind the scenes to research and synthesize.
    Rate limited to 5 requests per hour to prevent API abuse.
    """
    try:
        ideas = await generate_ideas_with_agents(
            field=idea_request.field,
            novelty_level=idea_request.noveltyLevel
        )
        return ideas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
