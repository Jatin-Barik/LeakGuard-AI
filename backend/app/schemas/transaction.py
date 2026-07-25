"""Transaction schemas."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import TransactionSource
from app.schemas.common import ORMModel


class TransactionResponse(ORMModel):
    id: str
    upload_id: str | None
    merchant: str
    normalized_merchant: str
    description: str | None
    amount: float
    currency: str
    category: str
    ai_category: str | None
    source: TransactionSource
    confidence_score: float
    is_recurring_prediction: bool
    occurred_at: datetime
    created_at: datetime
    updated_at: datetime


class TransactionCreateRequest(BaseModel):
    merchant: str = Field(min_length=1, max_length=255)
    amount: float = Field(gt=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    category: str = Field(default="other", max_length=48)
    description: str | None = None
    occurred_at: datetime
    is_recurring_prediction: bool = False


class TransactionUpdateRequest(BaseModel):
    merchant: str | None = Field(default=None, min_length=1, max_length=255)
    amount: float | None = Field(default=None, gt=0)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    category: str | None = Field(default=None, max_length=48)
    ai_category: str | None = Field(default=None, max_length=48)
    description: str | None = None
    occurred_at: datetime | None = None
    is_recurring_prediction: bool | None = None


class TransactionListResponse(BaseModel):
    items: list[TransactionResponse]
    total: int
    page: int
    limit: int
