import os
from crewai import Agent, Task, Crew, Process, LLM
from app.agents.tools import WebSearchTool, AcademicSearchTool
from app.core.config import settings

def get_llm() -> LLM:
    """Initialize the LLM based on configuration."""
    if settings.LLM_PROVIDER == "huggingface":
        # Set HF_TOKEN env var for CrewAI/LiteLLM to pick up
        if settings.HF_TOKEN:
            os.environ["HF_TOKEN"] = settings.HF_TOKEN
            os.environ["HUGGINGFACE_API_KEY"] = settings.HF_TOKEN
        
        # Using Mistral 7B Instruct - free tier, good for structured output
        # Alternative models: meta-llama/Llama-3.2-3B-Instruct, microsoft/Phi-3-mini-4k-instruct
        return LLM(
            model="huggingface/mistralai/Mistral-7B-Instruct-v0.3",
            api_key=settings.HF_TOKEN
        )
    else:
        # Fallback to Ollama for local development
        return LLM(
            model="ollama/llama3.2",
            base_url=settings.OLLAMA_BASE_URL
        )

def create_idea_generation_crew(field: str, novelty_level: int) -> Crew:
    """Create and configure the CrewAI pipeline for idea generation."""
    
    llm = get_llm()
    search_tool = WebSearchTool()
    academic_tool = AcademicSearchTool()
    
    # Define Agents
    researcher = Agent(
        role='Senior Industry & Academic Researcher',
        goal=f'Uncover the latest trends, breakthroughs, and white spaces in {field}.',
        backstory=(
            "You are a world-class researcher specializing in emerging technologies. "
            "Your expertise lies in analyzing both academic literature and commercial markets "
            "to identify opportunities that most people miss."
        ),
        verbose=True,
        allow_delegation=False,
        tools=[search_tool, academic_tool],
        llm=llm
    )
    
    analyst = Agent(
        role='Startup Ideation Strategist',
        goal=f'Synthesize research into viable, structured startup ideas with a novelty score matching level {novelty_level} (1-10 scale).',
        backstory=(
            "You are an elite startup builder and venture capitalist. "
            "You excel at taking raw research and turning it into actionable, "
            "high-potential business concepts. You always ground your ideas in solid evidence."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llm
    )
    
    # Define Tasks
    research_task = Task(
        description=(
            f"Conduct comprehensive research on the `{field}` industry. "
            "1. Identify the top 3 emerging trends or recent academic breakthroughs. "
            "2. Identify the major unsolved problems or commercial bottlenecks. "
            f"Focus your research to support innovations at a novelty level of {novelty_level}/10 "
            "(1 = incremental improvement, 10 = radical breakthrough)."
        ),
        expected_output="A detailed report summarizing trends, breakthroughs, and unsolved problems in the requested field.",
        agent=researcher
    )
    
    ideation_task = Task(
        description=(
            f"Based on the research report, generate EXACTLY 3 distinct startup ideas in `{field}`. "
            f"Ensure the ideas reflect a novelty level of roughly {novelty_level}/10. "
            "For each idea, provide a structured breakdown."
            "CRITICAL: The final output must ONLY be valid JSON matching this schema exactly, with NO markdown formatting, NO conversational text, JUST the raw JSON array:\n"
            "[\n"
            "  {\n"
            '    "id": "uuid-v4-string",\n'
            '    "title": "Short Catchy Idea Name",\n'
            '    "description": "Clear 2-sentence description of the problem and your solution.",\n'
            '    "marketPotential": "High/Medium/Low with brief justification",\n'
            '    "feasibility": "High/Medium/Low with brief justification",\n'
            f'    "noveltyScore": {novelty_level},\n'
            '    "confidenceScore": 75,\n'
            f'    "field": "{field}",\n'
            '    "researchCitations": ["URL 1", "URL 2"]\n'
            "  }\n"
            "]\n"
            "For confidenceScore: estimate 60-90 based on how well-supported the idea is by research (higher = more citations/evidence)."
        ),
        expected_output="A raw JSON array of 3 startup ideas matching the exact valid JSON schema requested.",
        agent=analyst
    )
    
    # Assemble Crew
    return Crew(
        agents=[researcher, analyst],
        tasks=[research_task, ideation_task],
        process=Process.sequential,
        verbose=True
    )
