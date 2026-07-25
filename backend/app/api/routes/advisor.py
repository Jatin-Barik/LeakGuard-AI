from typing import Any

from fastapi import APIRouter, Request as FastAPIRequest
from pydantic import BaseModel, Field

from app.services.gemini_service import gemini_service
from app.services.financial_intelligence import financial_advisor_engine
from app.core.config import get_settings
from app.core.rate_limit import enforce_rate_limit

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1_000)
    context: dict[str, Any] = Field(default_factory=dict, max_length=30)


class ChatResponse(BaseModel):
    response: str
    model: str = "gemini-2.0-flash"


@router.post("/advisor/chat", response_model=ChatResponse)
async def chat_with_advisor(http_request: FastAPIRequest, request: ChatRequest):
    settings = get_settings()
    enforce_rate_limit(
        http_request.client.host if http_request.client else "unknown",
        limit=min(settings.rate_limit_per_minute, 20),
    )

    message = request.message.strip()
    if request.context.get("intelligence_report"):
        advisor_result = financial_advisor_engine.answer(
            message,
            request.context["intelligence_report"],
        )
        return ChatResponse(response=advisor_result["metadata"]["answer"])

    response = await gemini_service.chat_advisor(
        message,
        request.context,
    )
    return ChatResponse(response=response)
