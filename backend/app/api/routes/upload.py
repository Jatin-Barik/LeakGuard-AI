from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.rate_limit import enforce_rate_limit
from app.services.transaction_parser import (
    detect_recurring_patterns,
    parse_csv_transactions,
    parse_text_transactions,
)
from app.services.file_extraction import extract_upload_text
from app.services.financial_intelligence import financial_intelligence_pipeline

router = APIRouter()
ALLOWED_EXTENSIONS = {"csv", "txt", "json", "eml", "mbox", "xlsx", "xls", "pdf"}


class UploadResponse(BaseModel):
    transactions_extracted: int
    recurring_detected: int
    transactions: list[dict]
    recurring_payments: list[dict]
    intelligence_report: dict
    message: str


@router.post("/upload", response_model=UploadResponse)
async def upload_file(request: Request, file: UploadFile = File(...)):
    settings = get_settings()
    enforce_rate_limit(
        request.client.host if request.client else "unknown",
        limit=min(settings.rate_limit_per_minute, 30),
    )
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    filename = file.filename.lower()
    extension = filename.rsplit(".", 1)[-1] if "." in filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=415, detail="Unsupported file type")

    content = await file.read()
    if len(content) == 0 or len(content) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail=f"Files must be between 1 byte and {settings.max_upload_bytes // 1024 // 1024} MB")

    try:
        text_content = extract_upload_text(content, filename)
    except UnicodeDecodeError as error:
        raise HTTPException(status_code=400, detail="Unable to decode this text file as UTF-8") from error

    report = await financial_intelligence_pipeline.process(text_content, filename)
    transactions = report["transactions"]
    recurring = report["subscriptions"]

    if not transactions:
        if filename.endswith(".csv"):
            transactions = parse_csv_transactions(text_content)
        elif filename.endswith((".txt", ".json", ".eml", ".mbox", ".pdf", ".xlsx", ".xls")):
            transactions = parse_text_transactions(text_content)
        else:
            transactions = parse_text_transactions(text_content)
        recurring = detect_recurring_patterns(transactions)

    return UploadResponse(
        transactions_extracted=len(transactions),
        recurring_detected=len(recurring),
        transactions=transactions[:50],
        recurring_payments=recurring,
        intelligence_report=report,
        message=f"Successfully processed {file.filename}",
    )
