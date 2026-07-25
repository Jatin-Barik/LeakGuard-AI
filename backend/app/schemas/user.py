"""User profile schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import ORMModel


class UserProfile(ORMModel):
    id: str
    email: EmailStr
    display_name: str | None
    avatar_url: str | None
    currency: str
    timezone: str
    is_active: bool
    email_verified: bool
    total_saved: float
    member_since: datetime
    created_at: datetime
    updated_at: datetime


class UserUpdateRequest(BaseModel):
    display_name: str | None = Field(default=None, max_length=160)
    avatar_url: str | None = None
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    timezone: str | None = Field(default=None, max_length=64)
