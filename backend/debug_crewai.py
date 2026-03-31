import asyncio
import sys
import logging
from app.services.idea_service import generate_ideas_with_agents

logging.basicConfig(level=logging.DEBUG)

async def main():
    print("Starting CrewAI debug...")
    try:
        ideas = await generate_ideas_with_agents("HealthTech", 7)
        for i in ideas:
            print(f"Title: {i.title}")
            print(f"Desc: {i.description}")
            print("---")
    except Exception as e:
        print("Fatal Exception:", e)

if __name__ == "__main__":
    asyncio.run(main())
