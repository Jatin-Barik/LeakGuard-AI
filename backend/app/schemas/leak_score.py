"""Leak score schemas."""

from datetime import datetime

from pydantic import BaseModel

from app.models.enums import RiskLevel
from app.schemas.common import ORMModel


class LeakScoreBreakdown(ORMModel):
    id: str
    overall_score: int
    unused_subscriptions_score: int
    duplicate_subscriptions_score: int
    price_hikes_score: int
    large_expenses_score: int
    spending_trend_score: int
    monthly_waste: float
    annual_waste: float
    risk_level: RiskLevel
    reasoning: list[str]
    algorithm_version: str
    generated_at: datetime


class LeakScoreResponse(BaseModel):
    leak_score: LeakScoreBreakdown | None
    message: str | None = None
