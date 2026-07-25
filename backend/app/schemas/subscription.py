"""Subscription schemas."""

from datetime import datetime

from pydantic import BaseModel

from app.models.enums import SubscriptionFrequency, SubscriptionStatus
from app.schemas.common import ORMModel


class SubscriptionResponse(ORMModel):
    id: str
    merchant: str
    normalized_merchant: str
    plan: str | None
    frequency: SubscriptionFrequency
    monthly_cost: float
    annual_cost: float
    previous_monthly_cost: float | None
    price_increase_percent: float | None
    category: str
    status: SubscriptionStatus
    is_unused: bool
    is_duplicate: bool
    duplicate_group_id: str | None
    usage_score: float | None
    confidence: float
    last_charge_at: datetime | None
    next_charge_at: datetime | None
    created_at: datetime
    updated_at: datetime


class SubscriptionListResponse(BaseModel):
    items: list[SubscriptionResponse]
    total: int
