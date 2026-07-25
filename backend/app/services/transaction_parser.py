import csv
import io
import re
from datetime import datetime
from typing import Any


KNOWN_SUBSCRIPTION_MERCHANTS = {
    "netflix", "spotify", "amazon", "prime", "disney", "apple", "google",
    "adobe", "openai", "chatgpt", "planet fitness", "hulu", "hbo", "youtube",
    "microsoft", "dropbox", "icloud", "nyt", "new york times", "gym",
}


def parse_csv_transactions(content: str) -> list[dict[str, Any]]:
    """Parse CSV bank statement export."""
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
            "is_recurring": is_recurring,
            "confidence": 0.85 if is_recurring else 0.5,
        })

    return transactions


def parse_text_transactions(content: str) -> list[dict[str, Any]]:
    """Parse plain text SMS/email exports."""
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
                "is_recurring": _is_likely_subscription(merchant),
                "confidence": 0.7,
            })

    return transactions


def detect_recurring_patterns(transactions: list[dict]) -> list[dict]:
    """Detect recurring payment patterns from transaction list."""
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
                "frequency": "monthly",
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


def _extract_merchant(line: str) -> str:
    for known in KNOWN_SUBSCRIPTION_MERCHANTS:
        if known in line.lower():
            return known.title()
    words = line.split()
    return " ".join(words[:3]) if words else "Unknown"
