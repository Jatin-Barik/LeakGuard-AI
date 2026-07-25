"""Leak score snapshot model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import RiskLevel

if TYPE_CHECKING:
    from app.models.user import User


class LeakScore(Base):
    __tablename__ = "leak_scores"
    __table_args__ = (Index("ix_leak_scores_user_generated", "user_id", "generated_at"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    overall_score: Mapped[int] = mapped_column(Integer, nullable=False)
    unused_subscriptions_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    duplicate_subscriptions_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    price_hikes_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    large_expenses_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    spending_trend_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    monthly_waste: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    annual_waste: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    risk_level: Mapped[RiskLevel] = mapped_column(default=RiskLevel.MEDIUM, nullable=False)
    reasoning: Mapped[list[Any]] = mapped_column(JSON, default=list, nullable=False)
    algorithm_version: Mapped[str] = mapped_column(String(16), default="1.0.0", nullable=False)
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="leak_scores")
