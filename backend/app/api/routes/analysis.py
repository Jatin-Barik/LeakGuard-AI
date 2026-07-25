from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import gemini_service

router = APIRouter()


class LeakScoreRequest(BaseModel):
    subscriptions: list[dict]
    price_hikes: list[dict] = []
    duplicates: list[dict] = []


class RecommendationRequest(BaseModel):
    subscriptions: list[dict]
    usage: list[dict] = []


class CategorizeRequest(BaseModel):
    merchant: str
    amount: float
    date: str
    description: str = ""


@router.post("/analysis/leak-score")
async def generate_leak_score(request: LeakScoreRequest):
    result = await gemini_service.generate_leak_score(
        request.subscriptions,
        request.price_hikes,
        request.duplicates,
    )
    return result


@router.post("/analysis/recommendations")
async def generate_recommendations(request: RecommendationRequest):
    result = await gemini_service.generate_recommendations(
        request.subscriptions,
        request.usage,
    )
    return {"recommendations": result}


@router.post("/analysis/categorize")
async def categorize_transaction(request: CategorizeRequest):
    result = await gemini_service.categorize_transaction(
        request.merchant,
        request.amount,
        request.date,
        request.description,
    )
    return result
