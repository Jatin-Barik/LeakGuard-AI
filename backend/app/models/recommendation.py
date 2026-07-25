"""AI recommendation model."""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin
from app.models.enums import RecommendationAction, RecommendationPriority, RecommendationStatus

if TYPE_CHECKING:
    from app.models.subscription import Subscription
    from app.models.user import User


class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"
    __table_args__ = (
        Index("ix_recommendations_user_status", "user_id", "status"),
        Index("ix_recommendations_user_priority", "user_id", "priority"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    subscription_id: Mapped[str | None] = mapped_column(ForeignKey("subscriptions.id", ondelete="SET NULL"), index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    recommendation: Mapped[str] = mapped_column(Text, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    estimated_monthly_savings: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    estimated_annual_savings: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    priority: Mapped[RecommendationPriority] = mapped_column(default=RecommendationPriority.MEDIUM, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    action_type: Mapped[RecommendationAction] = mapped_column(nullable=False)
    status: Mapped[RecommendationStatus] = mapped_column(default=RecommendationStatus.PENDING, index=True, nullable=False)
    source: Mapped[str] = mapped_column(String(32), default="rule_engine", nullable=False)

    user: Mapped["User"] = relationship(back_populates="recommendations")
    subscription: Mapped["Subscription | None"] = relationship(back_populates="recommendations")
