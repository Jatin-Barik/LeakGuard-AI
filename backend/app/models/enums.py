"""Shared SQLAlchemy enumerations."""

import enum


class UploadStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ProcessingStatus(str, enum.Enum):
    QUEUED = "queued"
    EXTRACTING = "extracting"
    PARSING = "parsing"
    ANALYZING = "analyzing"
    DONE = "done"
    ERROR = "error"


class FileType(str, enum.Enum):
    PDF = "pdf"
    CSV = "csv"
    EXCEL = "excel"
    SMS = "sms"
    EMAIL = "email"
    IMAGE = "image"
    JSON = "json"
    TXT = "txt"
    UNKNOWN = "unknown"


class TransactionSource(str, enum.Enum):
    UPLOAD = "upload"
    MANUAL = "manual"
    API = "api"


class SubscriptionFrequency(str, enum.Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"
    UNKNOWN = "unknown"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class RecommendationAction(str, enum.Enum):
    CANCEL = "cancel"
    DOWNGRADE = "downgrade"
    PAUSE = "pause"
    NEGOTIATE = "negotiate"
    BUNDLE = "bundle"
    KEEP = "keep"


class RecommendationPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RecommendationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DISMISSED = "dismissed"
    COMPLETED = "completed"


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ReportType(str, enum.Enum):
    MONTHLY = "monthly"
    LEAK_AUDIT = "leak_audit"
    EXPORT_PDF = "export_pdf"
    EXPORT_CSV = "export_csv"


class ReportStatus(str, enum.Enum):
    GENERATING = "generating"
    READY = "ready"
    FAILED = "failed"


class NotificationType(str, enum.Enum):
    PRICE_HIKE = "price_hike"
    DUPLICATE = "duplicate"
    LEAK_ALERT = "leak_alert"
    RECOMMENDATION = "recommendation"
    UPLOAD_COMPLETE = "upload_complete"
    SYSTEM = "system"


class NotificationStatus(str, enum.Enum):
    UNREAD = "unread"
    READ = "read"
    ARCHIVED = "archived"


class ChatRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
