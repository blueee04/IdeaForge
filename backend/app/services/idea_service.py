import uuid
import json
import logging
from app.models.schemas import Idea
from app.agents.crew import create_idea_generation_crew
import asyncio

logger = logging.getLogger(__name__)

async def generate_ideas_with_agents(field: str, novelty_level: int) -> list[Idea]:
    """
    Run the CrewAI pipeline to generate startup ideas based on user inputs.
    """
    try:
        # CrewAI is synchronous, so we run it in a threadpool
        crew = create_idea_generation_crew(field, novelty_level)
        result = await asyncio.to_thread(crew.kickoff)
        
        # Clean the output (LLMs sometimes wrap JSON in markdown blocks)
        raw_output = str(result.raw).strip()
        if raw_output.startswith("```json"):
            raw_output = raw_output[7:-3].strip()
        elif raw_output.startswith("```"):
            raw_output = raw_output[3:-3].strip()
            
        # Parse the JSON
        data = json.loads(raw_output)
        
        # Convert to Pydantic models
        ideas = []
        for item in data:
            # Ensure an ID exists
            if "id" not in item or not item["id"] or item["id"] == "uuid-v4-string":
                item["id"] = str(uuid.uuid4())
            ideas.append(Idea(**item))
            
        return ideas
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM output as JSON. Output was: {result.raw}")
        # Fallback mechanism
        return generate_fallback_ideas(field, novelty_level)
        
    except Exception as e:
        logger.error(f"CrewAI pipeline failed: {str(e)}")
        # Fallback mechanism
        return generate_fallback_ideas(field, novelty_level)

def generate_fallback_ideas(field: str, novelty_level: int) -> list[Idea]:
    """Fallback static generator if AI pipeline fails."""
    return [
        Idea(
            id=str(uuid.uuid4()),
            title=f"AI-Powered {field} Platform",
            description=f"A next-generation platform for the {field} industry leveraging AI.",
            marketPotential="High",
            feasibility="Medium",
            noveltyScore=novelty_level,
            confidenceScore=70,
            field=field,
            researchCitations=["https://arxiv.org/abs/example"]
        )
    ]
