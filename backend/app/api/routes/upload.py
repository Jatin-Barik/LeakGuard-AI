from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel

from app.services.transaction_parser import (
    detect_recurring_patterns,
    parse_csv_transactions,
    parse_text_transactions,
)

router = APIRouter()


class UploadResponse(BaseModel):
    transactions_extracted: int
    recurring_detected: int
    transactions: list[dict]
    recurring_payments: list[dict]
    message: str


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    filename = file.filename.lower()

    try:
        text_content = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Unable to decode file. Try CSV or text format.")

    if filename.endswith(".csv"):
        transactions = parse_csv_transactions(text_content)
    elif filename.endswith((".txt", ".json", ".eml")):
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
