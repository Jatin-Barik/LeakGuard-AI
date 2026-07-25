"""File upload model."""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin
from app.models.enums import FileType, ProcessingStatus, UploadStatus

if TYPE_CHECKING:
    from app.models.transaction import Transaction
    from app.models.user import User


class Upload(Base, TimestampMixin):
    __tablename__ = "uploads"
    __table_args__ = (
        Index("ix_uploads_user_status", "user_id", "status"),
        Index("ix_uploads_user_created", "user_id", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)

    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    file_type: Mapped[FileType] = mapped_column(default=FileType.UNKNOWN, nullable=False)
    mime_type: Mapped[str | None] = mapped_column(String(128))
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    checksum_sha256: Mapped[str | None] = mapped_column(String(64), index=True)

    status: Mapped[UploadStatus] = mapped_column(default=UploadStatus.PENDING, index=True, nullable=False)
    processing_status: Mapped[ProcessingStatus] = mapped_column(default=ProcessingStatus.QUEUED, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text)
    transaction_count: Mapped[int] = mapped_column(default=0, nullable=False)
    processing_ms: Mapped[int | None] = mapped_column()

    user: Mapped["User"] = relationship(back_populates="uploads")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="upload", cascade="all, delete-orphan")
