"""Detected subscription model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin
from app.models.enums import SubscriptionFrequency, SubscriptionStatus

if TYPE_CHECKING:
    from app.models.recommendation import Recommendation
    from app.models.user import User


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"
    __table_args__ = (
        UniqueConstraint("user_id", "normalized_merchant", name="uq_subscription_merchant"),
        Index("ix_subscriptions_user_active", "user_id", "status"),
        Index("ix_subscriptions_user_category", "user_id", "category"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    merchant: Mapped[str] = mapped_column(String(255), nullable=False)
    normalized_merchant: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    plan: Mapped[str | None] = mapped_column(String(128))
    frequency: Mapped[SubscriptionFrequency] = mapped_column(default=SubscriptionFrequency.UNKNOWN, nullable=False)
    monthly_cost: Mapped[float] = mapped_column(nullable=False)
    annual_cost: Mapped[float] = mapped_column(nullable=False)
    previous_monthly_cost: Mapped[float | None] = mapped_column()
    price_increase_percent: Mapped[float | None] = mapped_column(Float)
    category: Mapped[str] = mapped_column(String(48), default="other", nullable=False)
    status: Mapped[SubscriptionStatus] = mapped_column(default=SubscriptionStatus.ACTIVE, index=True, nullable=False)
    is_unused: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_duplicate: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    duplicate_group_id: Mapped[str | None] = mapped_column(String(36), index=True)
    usage_score: Mapped[float | None] = mapped_column(Float)
    confidence: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    last_charge_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    next_charge_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    metadata_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    cancel_url: Mapped[str | None] = mapped_column(Text)

    user: Mapped["User"] = relationship(back_populates="subscriptions")
    recommendations: Mapped[list["Recommendation"]] = relationship(back_populates="subscription")
