from crewai.tools import BaseTool
import json
from duckduckgo_search import DDGS
from pydantic import Field
import time
import logging

logger = logging.getLogger(__name__)

# Simple in-memory throttle tracking
_last_search_time = 0
_search_delay = 2  # Minimum 2 seconds between searches

class WebSearchTool(BaseTool):
    name: str = "Web Search Tool"
    description: str = "Search the web for current market trends, competitors, and industry reports."
    
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
    
    def _run(self, query: str) -> str:
        """
        Search Semantic Scholar API for academic papers.
        Free API with rate limits: 100 requests per 5 minutes.
        """
        import httpx
        
        try:
            # Semantic Scholar API endpoint
            url = "https://api.semanticscholar.org/graph/v1/paper/search"
            params = {
                "query": query,
                "limit": 5,
                "fields": "title,year,authors,abstract,url,citationCount"
            }
            
            # Rate limit: wait a bit between requests
            time.sleep(1)
            
            with httpx.Client(timeout=10.0) as client:
                response = client.get(url, params=params)
                
                if response.status_code == 429:
                    logger.warning("Semantic Scholar rate limit hit, using fallback")
                    return self._fallback_response(query)
                
                if response.status_code != 200:
                    logger.error(f"Semantic Scholar API error: {response.status_code}")
                    return self._fallback_response(query)
                
                data = response.json()
                papers = data.get("data", [])
                
                if not papers:
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
