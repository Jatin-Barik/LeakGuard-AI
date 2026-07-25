"""Financial transaction model."""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin
from app.models.enums import TransactionSource

if TYPE_CHECKING:
    from app.models.upload import Upload
    from app.models.user import User


class Transaction(Base, TimestampMixin):
    __tablename__ = "transactions"
    __table_args__ = (
        UniqueConstraint("user_id", "fingerprint", name="uq_transaction_fingerprint"),
        Index("ix_transactions_user_date", "user_id", "occurred_at"),
        Index("ix_transactions_user_category", "user_id", "category"),
        Index("ix_transactions_user_merchant", "user_id", "normalized_merchant"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    upload_id: Mapped[str | None] = mapped_column(ForeignKey("uploads.id", ondelete="SET NULL"), index=True)

    merchant: Mapped[str] = mapped_column(String(255), nullable=False)
    normalized_merchant: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    amount: Mapped[float] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    category: Mapped[str] = mapped_column(String(48), default="other", index=True, nullable=False)
    ai_category: Mapped[str | None] = mapped_column(String(48))
    source: Mapped[TransactionSource] = mapped_column(default=TransactionSource.UPLOAD, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    is_recurring_prediction: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    fingerprint: Mapped[str] = mapped_column(String(128), nullable=False)

    user: Mapped["User"] = relationship(back_populates="transactions")
    upload: Mapped["Upload | None"] = relationship(back_populates="transactions")
