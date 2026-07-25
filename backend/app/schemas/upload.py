"""Upload schemas."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import FileType, ProcessingStatus, UploadStatus
from app.schemas.common import ORMModel


class UploadResponse(ORMModel):
    id: str
    filename: str
    original_filename: str
    storage_path: str
    file_type: FileType
    mime_type: str | None
    file_size_bytes: int
    status: UploadStatus
    processing_status: ProcessingStatus
    error_message: str | None
    transaction_count: int
    processing_ms: int | None
    created_at: datetime
    updated_at: datetime


class UploadListResponse(BaseModel):
    items: list[UploadResponse]
    total: int


class UploadCreateResponse(BaseModel):
    upload: UploadResponse
    message: str = Field(default="Upload received and queued for processing")
