"""Recommendation schemas."""

from datetime import datetime

from pydantic import BaseModel

from app.models.enums import RecommendationAction, RecommendationPriority, RecommendationStatus
from app.schemas.common import ORMModel


class RecommendationResponse(ORMModel):
    id: str
    subscription_id: str | None
    title: str
    recommendation: str
    reason: str
    estimated_monthly_savings: float
    estimated_annual_savings: float
    priority: RecommendationPriority
    confidence: float
    action_type: RecommendationAction
    status: RecommendationStatus
    source: str
    created_at: datetime
    updated_at: datetime


class RecommendationListResponse(BaseModel):
    items: list[RecommendationResponse]
    total: int
