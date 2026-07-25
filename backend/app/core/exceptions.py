"""Application-specific exceptions and global error handlers."""

from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.logging import get_logger

logger = get_logger(__name__)


class AppError(Exception):
    """Base application error."""

    def __init__(
        self,
        message: str,
        *,
        code: str = "APP_ERROR",
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class AuthenticationError(AppError):
    def __init__(self, message: str = "Authentication failed", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code="AUTH_INVALID", status_code=status.HTTP_401_UNAUTHORIZED, details=details)


class AuthorizationError(AppError):
    def __init__(self, message: str = "Insufficient permissions", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code="AUTH_FORBIDDEN", status_code=status.HTTP_403_FORBIDDEN, details=details)


class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: str | None = None) -> None:
        message = f"{resource} not found"
        if resource_id:
            message = f"{resource} '{resource_id}' not found"
        super().__init__(message, code="NOT_FOUND", status_code=status.HTTP_404_NOT_FOUND)


class ConflictError(AppError):
    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code="CONFLICT", status_code=status.HTTP_409_CONFLICT, details=details)


class ValidationError(AppError):
    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code="VALIDATION_ERROR", status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, details=details)


class RateLimitError(AppError):
    def __init__(self, message: str = "Too many requests") -> None:
        super().__init__(message, code="RATE_LIMIT", status_code=status.HTTP_429_TOO_MANY_REQUESTS)


class UploadError(AppError):
    def __init__(self, message: str, *, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        super().__init__(message, code="UPLOAD_ERROR", status_code=status_code)


def _error_payload(code: str, message: str, details: dict[str, Any] | None = None, request_id: str | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"error": {"code": code, "message": message}}
    if details:
        payload["error"]["details"] = details
    if request_id:
        payload["request_id"] = request_id
    return payload


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload(exc.code, exc.message, exc.details, request_id),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_error_payload(
                "VALIDATION_ERROR",
                "Request validation failed",
                {"errors": exc.errors()},
                request_id,
            ),
        )

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        logger.warning("database_integrity_error", extra={"request_id": request_id, "error": str(exc.orig)})
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content=_error_payload("DATABASE_INTEGRITY", "Database constraint violation", request_id=request_id),
        )

    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        logger.exception("database_error", extra={"request_id": request_id})
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_payload("DATABASE_ERROR", "A database error occurred", request_id=request_id),
        )

    @app.exception_handler(Exception)
    async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        logger.exception("unhandled_error", extra={"request_id": request_id})
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_payload("INTERNAL_ERROR", "An unexpected error occurred", request_id=request_id),
        )
