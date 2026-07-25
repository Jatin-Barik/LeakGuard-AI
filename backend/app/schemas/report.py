"""Report schemas."""

from datetime import datetime

from pydantic import BaseModel

from app.models.enums import ReportStatus, ReportType
from app.schemas.common import ORMModel


class ReportResponse(ORMModel):
    id: str
    report_type: ReportType
    status: ReportStatus
    storage_path: str | None
    payload: dict
    error_message: str | None
    created_at: datetime
    updated_at: datetime


class GenerateReportRequest(BaseModel):
    report_type: ReportType = ReportType.LEAK_AUDIT
    period_days: int = 30


class ReportListResponse(BaseModel):
    items: list[ReportResponse]
    total: int
