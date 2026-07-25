"""Core relational model set for users, statement data, and AI insights."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    display_name: Mapped[str | None] = mapped_column(String(160))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    uploads: Mapped[list["Upload"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Upload(Base):
    __tablename__ = "uploads"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    filename: Mapped[str] = mapped_column(String(255))
    source_type: Mapped[str] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(24), default="completed", index=True)
    transaction_count: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    user: Mapped[User] = relationship(back_populates="uploads")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="upload", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (UniqueConstraint("user_id", "fingerprint", name="uq_transaction_fingerprint"), Index("ix_transactions_user_date", "user_id", "occurred_at"))
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    upload_id: Mapped[str | None] = mapped_column(ForeignKey("uploads.id", ondelete="SET NULL"))
    merchant: Mapped[str] = mapped_column(String(255), index=True)
    normalized_merchant: Mapped[str] = mapped_column(String(255), index=True)
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    category: Mapped[str] = mapped_column(String(48), index=True)
    occurred_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.5)
    fingerprint: Mapped[str] = mapped_column(String(128))
    upload: Mapped[Upload | None] = relationship(back_populates="transactions")


class Subscription(Base):
    __tablename__ = "subscriptions"
    __table_args__ = (UniqueConstraint("user_id", "normalized_merchant", name="uq_subscription_merchant"),)
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    merchant: Mapped[str] = mapped_column(String(255))
    normalized_merchant: Mapped[str] = mapped_column(String(255), index=True)
    amount: Mapped[float] = mapped_column(Float)
    frequency: Mapped[str] = mapped_column(String(24))
    category: Mapped[str] = mapped_column(String(48))
    usage_score: Mapped[float | None] = mapped_column(Float)
    active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    user: Mapped[User] = relationship(back_populates="subscriptions")


class Insight(Base):
    __tablename__ = "insights"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    kind: Mapped[str] = mapped_column(String(48), index=True)
    payload: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
