import csv
import io
import re
from datetime import datetime
from typing import Any

from app.services.financial_intelligence import (
    RecurringPaymentDetector,
    TransactionExtractor,
    TransactionNormalizer,
)


KNOWN_SUBSCRIPTION_MERCHANTS = {
    "netflix", "spotify", "amazon", "prime", "disney", "apple", "google",
    "adobe", "openai", "chatgpt", "planet fitness", "hulu", "hbo", "youtube",
    "microsoft", "dropbox", "icloud", "nyt", "new york times", "gym",
}

MERCHANT_CATEGORIES = {
    "netflix": "streaming", "prime": "streaming", "amazon": "streaming", "disney": "streaming", "hulu": "streaming", "hbo": "streaming",
    "spotify": "music", "apple music": "music", "youtube": "music",
    "google one": "cloud", "icloud": "cloud", "dropbox": "cloud",
    "planet fitness": "fitness", "gym": "fitness",
    "adobe": "software", "openai": "software", "chatgpt": "software", "microsoft": "software",
    "nyt": "news", "new york times": "news", "insurance": "insurance", "loan": "loan",
}


def parse_csv_transactions(content: str) -> list[dict[str, Any]]:
    """Parse CSV bank statement export."""
    extractor = TransactionExtractor()
    normalizer = TransactionNormalizer()
    rows, _ = extractor.extract(content, "statement.csv")
    records, _ = normalizer.normalize(rows, "csv")
    if records:
        return [_legacy_transaction(record) for record in records]

    transactions = []
    reader = csv.DictReader(io.StringIO(content))

    for i, row in enumerate(reader):
        merchant = (
            row.get("merchant")
            or row.get("description")
            or row.get("Merchant")
            or row.get("Description")
            or row.get("name")
            or "Unknown"
        )
        amount_str = (
            row.get("amount")
            or row.get("Amount")
            or row.get("debit")
            or row.get("Debit")
            or "0"
        )
        date_str = (
            row.get("date")
            or row.get("Date")
            or row.get("transaction_date")
            or datetime.now().isoformat()
        )

        try:
            amount = abs(float(re.sub(r"[^\d.-]", "", str(amount_str))))
        except ValueError:
            amount = 0.0

        is_recurring = _is_likely_subscription(merchant)
        transactions.append({
            "id": f"tx_{i}",
            "merchant": merchant.strip(),
            "amount": amount,
            "date": date_str,
            "category": _categorize_merchant(merchant),
            "is_recurring": is_recurring,
            "frequency": "monthly" if is_recurring else "unknown",
            "confidence": 0.85 if is_recurring else 0.5,
        })

    return transactions


def parse_text_transactions(content: str) -> list[dict[str, Any]]:
    """Parse plain text SMS/email exports."""
    extractor = TransactionExtractor()
    normalizer = TransactionNormalizer()
    rows, _ = extractor.extract(content, "statement.txt")
    records, _ = normalizer.normalize(rows, "text")
    if records:
        return [_legacy_transaction(record) for record in records]

    transactions = []
    patterns = [
        r"(?:Rs\.?|INR|USD|\$|₹)\s*([\d,]+\.?\d*)",
        r"([\d,]+\.?\d*)\s*(?:debited|charged|paid|deducted)",
    ]

    lines = content.strip().split("\n")
    for i, line in enumerate(lines):
        amount = 0.0
        for pattern in patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                try:
                    amount = float(match.group(1).replace(",", ""))
                    break
                except ValueError:
                    continue

        if amount > 0:
            merchant = _extract_merchant(line)
            transactions.append({
                "id": f"tx_{i}",
                "merchant": merchant,
                "amount": amount,
                "date": datetime.now().isoformat(),
                "category": _categorize_merchant(merchant),
                "is_recurring": _is_likely_subscription(merchant),
                "frequency": "monthly" if _is_likely_subscription(merchant) else "unknown",
                "confidence": 0.7,
            })

    return transactions


def detect_recurring_patterns(transactions: list[dict]) -> list[dict]:
    """Detect recurring payment patterns from transaction list."""
    try:
        normalizer = TransactionNormalizer()
        rows = [
            {
                "id": tx.get("id"),
                "merchant": tx.get("merchant"),
                "description": tx.get("description", tx.get("merchant", "")),
                "amount": tx.get("amount"),
                "currency": tx.get("currency", "USD"),
                "date": tx.get("date") or tx.get("transaction_date"),
                "account": tx.get("account"),
                "reference": tx.get("reference"),
                "raw": tx,
            }
            for tx in transactions
        ]
        records, _ = normalizer.normalize(rows, "legacy")
        detected, _ = RecurringPaymentDetector().detect(records)
        if detected:
            return [
                {
                    "merchant": item.merchant,
                    "amount": item.amount,
                    "frequency": item.frequency,
                    "occurrences": item.occurrences,
                    "confidence": item.confidence,
                    "transaction_ids": item.transaction_ids,
                    "next_expected_payment": item.next_expected_payment,
                    "reasoning": item.reasoning,
                    "explanation": item.explanation,
                }
                for item in detected
            ]
    except Exception:
        pass

    merchant_groups: dict[str, list] = {}

    for tx in transactions:
        key = tx["merchant"].lower().strip()
        if key not in merchant_groups:
            merchant_groups[key] = []
        merchant_groups[key].append(tx)

    recurring = []
    for merchant, txs in merchant_groups.items():
        if len(txs) >= 2:
            amounts = [t["amount"] for t in txs]
            avg_amount = sum(amounts) / len(amounts)
            variance = max(amounts) - min(amounts)

            recurring.append({
                "merchant": txs[0]["merchant"],
                "amount": round(avg_amount, 2),
                "frequency": _infer_frequency(txs),
                "occurrences": len(txs),
                "confidence": 0.9 if variance < avg_amount * 0.1 else 0.7,
                "transaction_ids": [t["id"] for t in txs],
            })
        elif _is_likely_subscription(merchant):
            recurring.append({
                "merchant": txs[0]["merchant"],
                "amount": txs[0]["amount"],
                "frequency": "monthly",
                "occurrences": 1,
                "confidence": 0.6,
                "transaction_ids": [txs[0]["id"]],
            })

    return recurring


def _is_likely_subscription(merchant: str) -> bool:
    merchant_lower = merchant.lower()
    return any(known in merchant_lower for known in KNOWN_SUBSCRIPTION_MERCHANTS)


def _categorize_merchant(merchant: str) -> str:
    merchant_lower = merchant.lower()
    for keyword, category in MERCHANT_CATEGORIES.items():
        if keyword in merchant_lower:
            return category
    return "other"


def _infer_frequency(transactions: list[dict]) -> str:
    """Infer a cadence from dates while gracefully handling bank-specific formats."""
    dates = sorted(date for tx in transactions if (date := _parse_date(str(tx.get("date", "")))))
    if len(dates) < 2:
        return "monthly"
    intervals = [(later - earlier).days for earlier, later in zip(dates, dates[1:])]
    average = sum(intervals) / len(intervals)
    if 5 <= average <= 9:
        return "weekly"
    if 20 <= average <= 40:
        return "monthly"
    if 75 <= average <= 110:
        return "quarterly"
    if 300 <= average <= 430:
        return "yearly"
    return "unknown"


def _parse_date(value: str):
    for pattern in ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(value[:10], pattern)
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _extract_merchant(line: str) -> str:
    for known in KNOWN_SUBSCRIPTION_MERCHANTS:
        if known in line.lower():
            return known.title()
    words = line.split()
    return " ".join(words[:3]) if words else "Unknown"


def _legacy_transaction(record) -> dict[str, Any]:
    return {
        "id": record.id,
        "merchant": record.normalized_merchant,
        "normalized_merchant": record.normalized_merchant,
        "amount": record.amount,
        "currency": record.currency,
        "date": record.transaction_date,
        "transaction_date": record.transaction_date,
        "description": record.description,
        "account": record.account,
        "reference": record.reference,
        "category": record.category,
        "is_recurring": False,
        "frequency": "unknown",
        "confidence": record.confidence,
        "reasoning": record.reasoning,
    }
