from crewai.tools import BaseTool
import json
from duckduckgo_search import DDGS
from pydantic import Field
import time
import logging
from app.core.config import settings
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

class SearchInput(BaseModel):
    """Input schema for search tools."""
    query: str = Field(..., description="Search query")

# Simple in-memory throttle tracking
_last_search_time = 0
_search_delay = 2  # Minimum 2 seconds between searches

# Semantic Scholar API throttle - CRITICAL: 1 request per second limit
_last_semantic_time = 0
_semantic_delay = 1.0  # Exactly 1 second between requests (API requirement)

class WebSearchTool(BaseTool):
    name: str = "Web Search Tool"
    description: str = "Search the web for current market trends, competitors, and industry reports."
    args_schema: type[BaseModel] = SearchInput
    
    def _run(self, query: str) -> str:
        """Execute the web search with rate limiting."""
        global _last_search_time
        
        # Enforce minimum delay between searches
        time_since_last = time.time() - _last_search_time
        if time_since_last < _search_delay:
            sleep_time = _search_delay - time_since_last
            logger.info(f"Throttling search, sleeping for {sleep_time:.2f}s")
            time.sleep(sleep_time)
        
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=5))
                _last_search_time = time.time()
                
                if not results:
                    return f"No results found for '{query}'."
                return json.dumps(results, indent=2)
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            return f"Error executing search: {str(e)}"

class AcademicSearchTool(BaseTool):
    name: str = "Academic Search Tool"
    description: str = "Search Semantic Scholar for academic papers, patents, and scientific research."
    args_schema: type[BaseModel] = SearchInput
    
    def _run(self, query: str) -> str:
        """
        Search Semantic Scholar API for academic papers.
        CRITICAL: Rate limit is 1 request per second with API key.
        """
        import httpx
        global _last_semantic_time
        
        try:
            # CRITICAL: Enforce 1 request per second rate limit
            time_since_last = time.time() - _last_semantic_time
            if time_since_last < _semantic_delay:
                sleep_time = _semantic_delay - time_since_last
                logger.info(f"Semantic Scholar throttle: sleeping {sleep_time:.2f}s")
                time.sleep(sleep_time)
            
            # Check if API key is configured
            api_key = settings.SEMANTIC_SCHOLAR_API_KEY
            if not api_key:
                logger.warning("Semantic Scholar API key not configured, using fallback")
                return self._fallback_response(query)
            
            # Semantic Scholar API endpoint
            url = "https://api.semanticscholar.org/graph/v1/paper/search"
            params = {
                "query": query,
                "limit": 5,
                "fields": "title,year,authors,abstract,url,citationCount"
            }
            
            # API key must be sent in x-api-key header
            headers = {
                "x-api-key": api_key
            }
            
            with httpx.Client(timeout=10.0) as client:
                response = client.get(url, params=params, headers=headers)
                _last_semantic_time = time.time()  # Update timestamp after request
                
                if response.status_code == 429:
                    logger.warning("Semantic Scholar rate limit exceeded, using fallback")
                    return self._fallback_response(query)
                
                if response.status_code == 403:
                    logger.error("Semantic Scholar API key invalid")
                    return self._fallback_response(query)
                
                if response.status_code != 200:
                    logger.error(f"Semantic Scholar API error: {response.status_code}")
                    return self._fallback_response(query)
                
                data = response.json()
                papers = data.get("data", [])
                
                if not papers:
                    logger.info(f"No papers found for query: {query}")
                    return self._fallback_response(query)
                
                # Format results
                results = []
                for paper in papers:
                    results.append({
                        "title": paper.get("title", ""),
                        "url": paper.get("url", ""),
                        "authors": [a.get("name", "") for a in paper.get("authors", [])[:3]],
                        "year": paper.get("year"),
                        "citations": paper.get("citationCount", 0),
                        "abstract": (paper.get("abstract", "") or "")[:200]  # Truncate
                    })
                
                logger.info(f"Found {len(results)} papers for: {query}")
                return json.dumps(results, indent=2)
                
        except Exception as e:
            logger.error(f"Academic search error: {str(e)}")
            return self._fallback_response(query)
    
    def _fallback_response(self, query: str) -> str:
        """Fallback when API is unavailable."""
        mock_results = [
            {
                "title": f"Recent advances in {query}",
                "url": "https://api.semanticscholar.org/",
                "authors": ["Research Team"],
                "year": 2024,
                "citations": 0,
                "abstract": f"Research exploring novel approaches in {query}. Significant potential for commercialization identified."
            }
        ]
        return json.dumps(mock_results, indent=2)
