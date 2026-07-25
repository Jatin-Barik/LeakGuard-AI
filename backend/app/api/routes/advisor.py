from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.gemini_service import gemini_service

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    context: dict = Field(default_factory=dict)


class ChatResponse(BaseModel):
    response: str
    model: str = "gemini-2.0-flash"


@router.post("/advisor/chat", response_model=ChatResponse)
async def chat_with_advisor(request: ChatRequest):
    response = await gemini_service.chat_advisor(
        request.message,
        request.context,
    )
    return ChatResponse(response=response)
