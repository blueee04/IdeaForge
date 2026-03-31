from typing import List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class UserPreferences(BaseModel):
    field: str
    noveltyLevel: int
    goal: str

class IdeaRequest(BaseModel):
    field: str
    noveltyLevel: int

class Idea(BaseModel):
    id: str
    title: str
    description: str
    marketPotential: str
    feasibility: str
    noveltyScore: int
    confidenceScore: int = Field(default=75, description="AI confidence in this idea (0-100)")
    field: str
    researchCitations: List[str]
    createdAt: str = Field(default_factory=lambda: datetime.now().isoformat())

class Expert(BaseModel):
    id: str
    name: str
    role: str
    field: str
    avatar: str
    domainAuthority: int
    publications: int
    bio: str
