from typing import List, Optional
from pydantic import BaseModel, Field

class Remedy(BaseModel):
    title: str = Field(..., description="Name of remedy or recommendation")
    category: str = Field(..., description="one of: herb, diet, lifestyle, yoga, breathing, other")
    instructions: str
    frequency: Optional[str] = None
    duration: Optional[str] = None
    rationale: Optional[str] = None
    cautions: List[str] = []

class RemedyPlan(BaseModel):
    user_id: int
    disclaimer: str
    plan: List[Remedy]

class AskRequest(BaseModel):
    user_id: int = Field(..., ge=1)
    question: str = Field(..., min_length=2)

class AskResponse(BaseModel):
    user_id: int
    answer_text: str
    plan: List[Remedy]
    disclaimer: str
