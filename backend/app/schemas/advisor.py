"""Advisor chat schemas."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import ChatRole
from app.schemas.common import ORMModel


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    session_id: str | None = None


class ChatMessageResponse(ORMModel):
    id: str
    session_id: str
    role: ChatRole
    content: str
    user_prompt: str | None
    assistant_response: str | None
    suggestions: list[str] | None
    created_at: datetime


class ChatResponse(BaseModel):
    session_id: str
    response: str
    suggestions: list[str] = Field(default_factory=list)
    message: ChatMessageResponse
