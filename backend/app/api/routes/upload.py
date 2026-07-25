from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from pydantic import BaseModel

from app.services.transaction_parser import (
    detect_recurring_patterns,
    parse_csv_transactions,
    parse_text_transactions,
)
from app.services.file_extraction import extract_upload_text
from app.core.rate_limit import enforce_rate_limit

router = APIRouter()


class UploadResponse(BaseModel):
    transactions_extracted: int
    recurring_detected: int
    transactions: list[dict]
    recurring_payments: list[dict]
    message: str


@router.post("/upload", response_model=UploadResponse)
async def upload_file(request: Request, file: UploadFile = File(...)):
    enforce_rate_limit(request.client.host if request.client else "unknown")
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    filename = file.filename.lower()
    if len(content) == 0 or len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Files must be between 1 byte and 10 MB")

    try:
        text_content = extract_upload_text(content, filename)
    except UnicodeDecodeError as error:
        raise HTTPException(status_code=400, detail="Unable to decode this text file as UTF-8") from error

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
        message=f"Successfully processed {file.filename}",
    )
