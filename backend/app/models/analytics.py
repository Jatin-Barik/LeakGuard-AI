"""Analytics event model."""

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import ForeignKey, Index, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class AnalyticsEvent(Base, TimestampMixin):
    __tablename__ = "analytics_events"
    __table_args__ = (
        Index("ix_analytics_events_user_name", "user_id", "event_name"),
        Index("ix_analytics_events_created", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    event_name: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    properties: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    user: Mapped["User | None"] = relationship(back_populates="analytics_events")
