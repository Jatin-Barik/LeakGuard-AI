"""Generated report model."""

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin
from app.models.enums import ReportStatus, ReportType

if TYPE_CHECKING:
    from app.models.user import User


class Report(Base, TimestampMixin):
    __tablename__ = "reports"
    __table_args__ = (Index("ix_reports_user_status", "user_id", "status"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    report_type: Mapped[ReportType] = mapped_column(nullable=False)
    status: Mapped[ReportStatus] = mapped_column(default=ReportStatus.GENERATING, index=True, nullable=False)
    storage_path: Mapped[str | None] = mapped_column(Text)
    payload: Mapped[dict[str, Any]] = mapped_column(default=dict, nullable=False)
    error_message: Mapped[str | None] = mapped_column(Text)

    user: Mapped["User"] = relationship(back_populates="reports")
