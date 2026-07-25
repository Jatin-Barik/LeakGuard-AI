from fastapi import APIRouter, Request as FastAPIRequest
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.core.rate_limit import enforce_rate_limit
from app.services.gemini_service import gemini_service
from app.services.financial_intelligence import financial_intelligence_pipeline

router = APIRouter()


class LeakScoreRequest(BaseModel):
    subscriptions: list[dict] = Field(default_factory=list, max_length=250)
    price_hikes: list[dict] = Field(default_factory=list, max_length=100)
    duplicates: list[dict] = Field(default_factory=list, max_length=100)


class RecommendationRequest(BaseModel):
    subscriptions: list[dict] = Field(default_factory=list, max_length=250)
    usage: list[dict] = Field(default_factory=list, max_length=250)


class CategorizeRequest(BaseModel):
    merchant: str = Field(min_length=1, max_length=160)
    amount: float = Field(ge=0, le=1_000_000)
    date: str = Field(min_length=4, max_length=40)
    description: str = Field(default="", max_length=500)


class PipelineAnalysisRequest(BaseModel):
    content: str = Field(min_length=1, max_length=1_000_000)
    filename: str = Field(default="transactions.csv", max_length=180)


def _limit(request: FastAPIRequest) -> None:
    settings = get_settings()
    enforce_rate_limit(
        request.client.host if request.client else "unknown",
        limit=settings.rate_limit_per_minute,
    )


@router.post("/analysis/leak-score")
async def generate_leak_score(http_request: FastAPIRequest, request: LeakScoreRequest):
    _limit(http_request)
    result = await gemini_service.generate_leak_score(
        request.subscriptions,
        request.price_hikes,
        request.duplicates,
    )
    return result


@router.post("/analysis/recommendations")
async def generate_recommendations(http_request: FastAPIRequest, request: RecommendationRequest):
    _limit(http_request)
    result = await gemini_service.generate_recommendations(
        request.subscriptions,
        request.usage,
    )
    return {"recommendations": result}


@router.post("/analysis/categorize")
async def categorize_transaction(http_request: FastAPIRequest, request: CategorizeRequest):
    _limit(http_request)
    result = await gemini_service.categorize_transaction(
        request.merchant,
        request.amount,
        request.date,
        request.description,
    )
    return result


@router.post("/analysis/process")
async def process_transactions(http_request: FastAPIRequest, request: PipelineAnalysisRequest):
    _limit(http_request)
    return await financial_intelligence_pipeline.process(request.content, request.filename)
