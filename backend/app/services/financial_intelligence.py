"""Explainable financial intelligence pipeline for LeakGuard AI."""

from __future__ import annotations

import csv
import hashlib
import io
import json
import re
import statistics
from collections import defaultdict
from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime, timedelta
from difflib import SequenceMatcher
from enum import Enum
from typing import Any

from app.services.gemini_service import GeminiService, gemini_service


class Frequency(str, Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"
    IRREGULAR = "irregular"
    UNKNOWN = "unknown"


class Category(str, Enum):
    ENTERTAINMENT = "Entertainment"
    FOOD = "Food"
    SHOPPING = "Shopping"
    TRAVEL = "Travel"
    UTILITIES = "Utilities"
    CLOUD = "Cloud"
    SOFTWARE = "Software"
    EDUCATION = "Education"
    INSURANCE = "Insurance"
    HEALTHCARE = "Healthcare"
    GAMING = "Gaming"
    MUSIC = "Music"
    FINANCE = "Finance"
    OTHER = "Other"


@dataclass(slots=True)
class AIDecision:
    confidence: float
    reasoning: list[str]
    explanation: str
    recommendations: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class TransactionRecord:
    id: str
    merchant: str
    normalized_merchant: str
    amount: float
    currency: str
    transaction_date: str
    description: str
    account: str | None
    reference: str | None
    category: str
    source: str
    confidence: float
    reasoning: list[str]
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class SubscriptionSignal:
    merchant: str
    category: str
    amount: float
    frequency: str
    occurrences: int
    confidence: float
    next_expected_payment: str | None
    transaction_ids: list[str]
    reasoning: list[str]
    explanation: str
    price_timeline: list[dict[str, Any]] = field(default_factory=list)
    unused_score: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)


class MerchantKnowledgeBase:
    """Curated merchant, category, and competitor knowledge for explainable fallbacks."""

    CANONICAL_ALIASES = {
        "Netflix": ["netflix", "netflix.com", "netflix india", "netflix inc"],
        "Amazon Prime": ["amazon prime", "prime video", "prime membership"],
        "Disney+": ["disney", "disney+", "hotstar", "disney hotstar"],
        "Hulu": ["hulu"],
        "HBO Max": ["hbo", "max.com", "hbomax"],
        "Spotify": ["spotify", "spotify usa"],
        "Apple Music": ["apple music", "itunes", "apple.com/bill"],
        "YouTube Premium": ["youtube premium", "youtube music", "google youtube"],
        "Dropbox": ["dropbox"],
        "Google One": ["google one", "google storage", "google cloud storage"],
        "iCloud": ["icloud", "apple icloud"],
        "Adobe": ["adobe", "creative cloud"],
        "Microsoft 365": ["microsoft 365", "office 365", "msft"],
        "OpenAI": ["openai", "chatgpt"],
        "Claude": ["claude", "anthropic"],
        "Gemini": ["gemini advanced", "google gemini"],
        "Coursera": ["coursera"],
        "Udemy": ["udemy"],
        "Planet Fitness": ["planet fitness"],
        "LinkedIn": ["linkedin premium"],
        "Notion": ["notion"],
    }

    CATEGORY_KEYWORDS = {
        Category.ENTERTAINMENT: ["netflix", "prime video", "disney", "hulu", "hbo", "hotstar", "movie", "cinema"],
        Category.MUSIC: ["spotify", "apple music", "youtube music", "soundcloud"],
        Category.CLOUD: ["dropbox", "icloud", "google one", "storage"],
        Category.SOFTWARE: ["adobe", "microsoft", "openai", "chatgpt", "claude", "gemini", "notion", "github"],
        Category.EDUCATION: ["coursera", "udemy", "skillshare", "edx"],
        Category.GAMING: ["steam", "xbox", "playstation", "nintendo", "epic games"],
        Category.FOOD: ["swiggy", "zomato", "doordash", "uber eats", "restaurant", "coffee"],
        Category.SHOPPING: ["amazon", "walmart", "target", "flipkart", "myntra"],
        Category.TRAVEL: ["uber", "lyft", "airbnb", "hotel", "airlines", "makemytrip"],
        Category.UTILITIES: ["electric", "water", "gas", "internet", "broadband", "phone", "telecom"],
        Category.INSURANCE: ["insurance", "geico", "progressive", "policy"],
        Category.HEALTHCARE: ["hospital", "pharmacy", "doctor", "clinic", "health"],
        Category.FINANCE: ["bank", "loan", "emi", "interest", "fee", "brokerage"],
    }

    DUPLICATE_GROUPS = {
        "video_streaming": ["Netflix", "Amazon Prime", "Disney+", "Hulu", "HBO Max"],
        "music": ["Spotify", "Apple Music", "YouTube Premium"],
        "cloud_storage": ["Dropbox", "Google One", "iCloud"],
        "ai_assistants": ["OpenAI", "Claude", "Gemini"],
        "office_software": ["Adobe", "Microsoft 365", "Notion"],
        "learning": ["Coursera", "Udemy"],
    }

    MONTHLY_SUBSCRIPTION_KEYWORDS = {
        "subscription",
        "membership",
        "premium",
        "renewal",
        "plan",
        "billing",
        "recurring",
        "autopay",
    }

    @classmethod
    def normalize_description(cls, value: str) -> str:
        text = value.lower()
        text = re.sub(r"\b\d{4,}\b", " ", text)
        text = re.sub(r"\b(auth|pos|upi|ach|visa|mastercard|debit|credit|txn|ref|id)\b", " ", text)
        text = re.sub(r"https?://|www\.|\.com|\.in|\.co", " ", text)
        text = re.sub(r"[^a-z0-9+& ]+", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    @classmethod
    def resolve(cls, merchant: str, description: str = "") -> tuple[str, float, list[str]]:
        cleaned = cls.normalize_description(f"{merchant} {description}")
        if not cleaned:
            return "Unknown Merchant", 0.15, ["Merchant text was empty after cleaning."]

        best_name = cleaned.title()
        best_score = 0.0
        for canonical, aliases in cls.CANONICAL_ALIASES.items():
            for alias in aliases:
                alias_score = SequenceMatcher(None, cleaned, alias).ratio()
                contains_score = 0.95 if alias in cleaned or cleaned in alias else 0.0
                score = max(alias_score, contains_score)
                if score > best_score:
                    best_name = canonical
                    best_score = score

        if best_score >= 0.82:
            return best_name, min(0.98, best_score), [f"Matched transaction text to canonical merchant {best_name}."]
        if best_score >= 0.66:
            return best_name, best_score, [f"Fuzzy merchant match suggests {best_name}, but confidence is moderate."]
        return cleaned.title(), 0.58, ["No curated merchant alias matched; used cleaned statement text."]

    @classmethod
    def categorize(cls, merchant: str, description: str = "") -> tuple[str, float, list[str]]:
        text = cls.normalize_description(f"{merchant} {description}")
        for category, keywords in cls.CATEGORY_KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                return category.value, 0.82, [f"Keyword evidence places this merchant in {category.value}."]
        return Category.OTHER.value, 0.48, ["No strong category signal was found; assigned Other."]

    @classmethod
    def duplicate_group_for(cls, merchant: str) -> str | None:
        for group, merchants in cls.DUPLICATE_GROUPS.items():
            if merchant in merchants:
                return group
        return None


class TransactionExtractor:
    """Extracts transactions from normalized upload text."""

    DATE_COLUMNS = ("date", "transaction date", "posted date", "occurred_at", "time")
    DESCRIPTION_COLUMNS = ("description", "details", "narration", "transaction", "merchant", "name")
    AMOUNT_COLUMNS = ("amount", "debit", "withdrawal", "charge", "paid out", "value")
    CREDIT_COLUMNS = ("credit", "deposit", "paid in")
    CURRENCY_COLUMNS = ("currency", "ccy")
    ACCOUNT_COLUMNS = ("account", "account number", "card")
    REFERENCE_COLUMNS = ("reference", "ref", "transaction id", "txn id")

    def extract(self, content: str, filename: str) -> tuple[list[dict[str, Any]], AIDecision]:
        extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else "txt"
        if extension == "json":
            rows = self._extract_json(content)
        elif self._looks_like_csv(content):
            rows = self._extract_csv(content)
        else:
            rows = self._extract_text(content)

        decision = AIDecision(
            confidence=0.92 if rows else 0.2,
            reasoning=[f"Detected {len(rows)} candidate transaction rows from {extension.upper()} content."],
            explanation="Statement content was converted into structured transaction candidates.",
            recommendations=[] if rows else ["Upload a cleaner export with date, description, and amount columns."],
            metadata={"source_type": extension, "candidate_count": len(rows)},
        )
        return rows, decision

    def _extract_csv(self, content: str) -> list[dict[str, Any]]:
        sample = content[:2048]
        try:
            dialect = csv.Sniffer().sniff(sample)
        except csv.Error:
            dialect = csv.excel
        reader = csv.DictReader(io.StringIO(content), dialect=dialect)
        if not reader.fieldnames:
            return []
        return [self._row_from_mapping(row, index) for index, row in enumerate(reader) if any(row.values())]

    def _extract_json(self, content: str) -> list[dict[str, Any]]:
        try:
            payload = json.loads(content)
        except json.JSONDecodeError:
            return []
        if isinstance(payload, dict):
            for key in ("transactions", "items", "data", "records"):
                if isinstance(payload.get(key), list):
                    payload = payload[key]
                    break
        if not isinstance(payload, list):
            return []
        rows = []
        for index, item in enumerate(payload):
            if isinstance(item, dict):
                rows.append(self._row_from_mapping(item, index))
        return rows

    def _extract_text(self, content: str) -> list[dict[str, Any]]:
        rows = []
        amount_pattern = re.compile(r"(?P<currency>INR|USD|EUR|GBP|Rs\.?|\$|₹)?\s*(?P<amount>-?\d[\d,]*\.?\d{0,2})", re.I)
        date_pattern = re.compile(r"(?P<date>\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})")
        for index, line in enumerate(content.splitlines()):
            if not line.strip():
                continue
            amount_matches = list(amount_pattern.finditer(line))
            date_match = date_pattern.search(line)
            if not amount_matches:
                continue
            amount_match = amount_matches[-1]
            raw_amount = amount_match.group("amount")
            amount = self._parse_amount(raw_amount)
            if amount <= 0:
                continue
            description = line.strip()
            merchant_text = line[: amount_match.start()].strip(" -|,")
            if date_match:
                merchant_text = merchant_text.replace(date_match.group("date"), "").strip(" -|,")
            rows.append(
                {
                    "id": f"tx_{index}",
                    "merchant": merchant_text or description,
                    "description": description,
                    "amount": amount,
                    "currency": self._parse_currency(amount_match.group("currency") or line),
                    "date": date_match.group("date") if date_match else "",
                    "account": None,
                    "reference": None,
                    "source": "text",
                    "raw": {"line": line},
                }
            )
        return rows

    def _row_from_mapping(self, row: dict[str, Any], index: int) -> dict[str, Any]:
        lowered = {str(key).strip().lower(): value for key, value in row.items()}
        description = self._first(lowered, self.DESCRIPTION_COLUMNS) or ""
        merchant = self._first(lowered, ("merchant", "name")) or description
        debit = self._first(lowered, self.AMOUNT_COLUMNS)
        credit = self._first(lowered, self.CREDIT_COLUMNS)
        amount = self._parse_amount(debit if debit not in (None, "") else credit)
        return {
            "id": str(self._first(lowered, ("id", "transaction_id")) or f"tx_{index}"),
            "merchant": str(merchant or "Unknown"),
            "description": str(description or merchant or ""),
            "amount": amount,
            "currency": self._parse_currency(str(self._first(lowered, self.CURRENCY_COLUMNS) or description or "")),
            "date": str(self._first(lowered, self.DATE_COLUMNS) or ""),
            "account": self._first(lowered, self.ACCOUNT_COLUMNS),
            "reference": self._first(lowered, self.REFERENCE_COLUMNS),
            "source": "structured",
            "raw": row,
        }

    def _looks_like_csv(self, content: str) -> bool:
        first_line = content.splitlines()[0] if content.splitlines() else ""
        return "," in first_line or "\t" in first_line or ";" in first_line

    def _first(self, row: dict[str, Any], names: tuple[str, ...]) -> Any:
        for name in names:
            if name in row and row[name] not in (None, ""):
                return row[name]
        return None

    def _parse_amount(self, value: Any) -> float:
        if value is None:
            return 0.0
        text = str(value)
        match = re.search(r"-?\d[\d,]*\.?\d*", text)
        if not match:
            return 0.0
        try:
            return abs(float(match.group().replace(",", "")))
        except ValueError:
            return 0.0

    def _parse_currency(self, value: str) -> str:
        text = value.upper()
        if "₹" in value or "RS" in text or "INR" in text:
            return "INR"
        if "€" in value or "EUR" in text:
            return "EUR"
        if "£" in value or "GBP" in text:
            return "GBP"
        return "USD"


class TransactionNormalizer:
    def normalize(self, rows: list[dict[str, Any]], source: str) -> tuple[list[TransactionRecord], AIDecision]:
        records = []
        seen = set()
        duplicate_count = 0
        low_confidence_count = 0

        for index, row in enumerate(rows):
            date_value, date_confidence, date_reason = self._parse_date(str(row.get("date") or ""))
            merchant, merchant_confidence, merchant_reason = MerchantKnowledgeBase.resolve(
                str(row.get("merchant") or ""), str(row.get("description") or "")
            )
            category, category_confidence, category_reason = MerchantKnowledgeBase.categorize(
                merchant, str(row.get("description") or "")
            )
            amount = round(float(row.get("amount") or 0.0), 2)
            fingerprint = self._fingerprint(merchant, amount, date_value, row.get("reference"))
            if fingerprint in seen or amount <= 0:
                duplicate_count += 1
                continue
            seen.add(fingerprint)
            confidence = round(min(0.98, statistics.mean([date_confidence, merchant_confidence, category_confidence])), 2)
            if confidence < 0.55:
                low_confidence_count += 1
            records.append(
                TransactionRecord(
                    id=str(row.get("id") or f"tx_{index}"),
                    merchant=str(row.get("merchant") or merchant),
                    normalized_merchant=merchant,
                    amount=amount,
                    currency=str(row.get("currency") or "USD").upper()[:3],
                    transaction_date=date_value.date().isoformat(),
                    description=self._clean_description(str(row.get("description") or row.get("merchant") or "")),
                    account=str(row.get("account")) if row.get("account") else None,
                    reference=str(row.get("reference")) if row.get("reference") else None,
                    category=category,
                    source=source,
                    confidence=confidence,
                    reasoning=[*merchant_reason, *category_reason, date_reason],
                    metadata={"raw": row.get("raw", {})},
                )
            )

        decision = AIDecision(
            confidence=0.9 if records else 0.2,
            reasoning=[
                f"Normalized {len(records)} transactions.",
                f"Removed {duplicate_count} duplicate or invalid rows.",
                f"{low_confidence_count} transactions need user review.",
            ],
            explanation="Merchant names, dates, currencies, and noisy descriptions were standardized.",
            recommendations=["Review low-confidence transactions."] if low_confidence_count else [],
            metadata={"duplicates_removed": duplicate_count, "low_confidence_count": low_confidence_count},
        )
        return records, decision

    def _parse_date(self, value: str) -> tuple[datetime, float, str]:
        patterns = ("%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%m-%d-%Y", "%d/%m/%y", "%m/%d/%y")
        cleaned = value.strip()[:10]
        for pattern in patterns:
            try:
                return datetime.strptime(cleaned, pattern), 0.92, f"Parsed date using {pattern}."
            except ValueError:
                continue
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).replace(tzinfo=None), 0.92, "Parsed ISO transaction date."
        except ValueError:
            return datetime.now(UTC).replace(tzinfo=None), 0.28, "Missing or unreadable date; used processing date with low confidence."

    def _clean_description(self, value: str) -> str:
        text = re.sub(r"\b\d{6,}\b", "", value)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def _fingerprint(self, merchant: str, amount: float, date_value: datetime, reference: Any) -> str:
        key = f"{merchant}|{amount:.2f}|{date_value.date().isoformat()}|{reference or ''}"
        return hashlib.sha256(key.encode("utf-8")).hexdigest()


class RecurringPaymentDetector:
    def detect(self, transactions: list[TransactionRecord]) -> tuple[list[SubscriptionSignal], AIDecision]:
        grouped: dict[str, list[TransactionRecord]] = defaultdict(list)
        for tx in transactions:
            grouped[tx.normalized_merchant].append(tx)

        subscriptions = []
        for merchant, items in grouped.items():
            items = sorted(items, key=lambda tx: tx.transaction_date)
            known_subscription = any(
                keyword in MerchantKnowledgeBase.normalize_description(f"{merchant} {' '.join(tx.description for tx in items)}")
                for keyword in MerchantKnowledgeBase.MONTHLY_SUBSCRIPTION_KEYWORDS
            )
            if len(items) < 2 and not known_subscription and MerchantKnowledgeBase.duplicate_group_for(merchant) is None:
                continue
            frequency, cadence_confidence, cadence_reason = self._infer_frequency(items)
            amount_confidence, amount_reason = self._amount_similarity(items)
            confidence = round(min(0.98, 0.25 + (0.35 * cadence_confidence) + (0.25 * amount_confidence) + (0.15 if known_subscription else 0)), 2)
            if len(items) == 1:
                confidence = max(confidence, 0.56)
            avg_amount = round(statistics.mean(tx.amount for tx in items), 2)
            next_payment = self._next_expected(items, frequency)
            subscriptions.append(
                SubscriptionSignal(
                    merchant=merchant,
                    category=items[0].category,
                    amount=avg_amount,
                    frequency=frequency.value,
                    occurrences=len(items),
                    confidence=confidence,
                    next_expected_payment=next_payment,
                    transaction_ids=[tx.id for tx in items],
                    reasoning=[cadence_reason, amount_reason],
                    explanation=f"{merchant} looks {frequency.value} because charges recur with similar timing and amount.",
                    price_timeline=[{"date": tx.transaction_date, "amount": tx.amount} for tx in items],
                    metadata={"known_subscription_keyword": known_subscription},
                )
            )

        decision = AIDecision(
            confidence=0.88 if subscriptions else 0.55,
            reasoning=[f"Detected {len(subscriptions)} recurring payment patterns using merchant, amount, and date proximity."],
            explanation="Recurring payments were inferred from repeated merchant charges and subscription-like evidence.",
            recommendations=[],
            metadata={"subscription_count": len(subscriptions)},
        )
        return subscriptions, decision

    def _infer_frequency(self, items: list[TransactionRecord]) -> tuple[Frequency, float, str]:
        dates = [datetime.fromisoformat(tx.transaction_date) for tx in items]
        if len(dates) < 2:
            return Frequency.MONTHLY, 0.42, "Single known subscription-like charge; assumed monthly with moderate confidence."
        intervals = [(later - earlier).days for earlier, later in zip(dates, dates[1:]) if (later - earlier).days > 0]
        if not intervals:
            return Frequency.UNKNOWN, 0.25, "Dates did not provide usable intervals."
        average = statistics.mean(intervals)
        spread = statistics.pstdev(intervals) if len(intervals) > 1 else 0
        cadence = [
            (Frequency.WEEKLY, 7, 3),
            (Frequency.MONTHLY, 30, 10),
            (Frequency.QUARTERLY, 91, 20),
            (Frequency.YEARLY, 365, 45),
        ]
        best_frequency, expected, tolerance = min(cadence, key=lambda item: abs(average - item[1]))
        if abs(average - expected) <= tolerance:
            confidence = max(0.5, 1 - (spread / max(expected, 1)))
            return best_frequency, round(min(0.95, confidence), 2), f"Average interval is {average:.1f} days, consistent with {best_frequency.value} billing."
        return Frequency.IRREGULAR, 0.5, f"Average interval is {average:.1f} days, suggesting an irregular recurring pattern."

    def _amount_similarity(self, items: list[TransactionRecord]) -> tuple[float, str]:
        if len(items) < 2:
            return 0.5, "Only one amount is available."
        amounts = [tx.amount for tx in items]
        mean = statistics.mean(amounts)
        spread = max(amounts) - min(amounts)
        tolerance = mean * 0.12
        confidence = 0.92 if spread <= tolerance else max(0.45, 1 - (spread / mean))
        return round(confidence, 2), f"Charge amounts vary by {spread:.2f} around an average of {mean:.2f}."

    def _next_expected(self, items: list[TransactionRecord], frequency: Frequency) -> str | None:
        last_date = datetime.fromisoformat(max(tx.transaction_date for tx in items))
        days = {
            Frequency.WEEKLY: 7,
            Frequency.MONTHLY: 30,
            Frequency.QUARTERLY: 91,
            Frequency.YEARLY: 365,
            Frequency.IRREGULAR: 30,
        }.get(frequency)
        return (last_date + timedelta(days=days)).date().isoformat() if days else None


class PriceHikeDetector:
    def detect(self, subscriptions: list[SubscriptionSignal]) -> tuple[list[dict[str, Any]], AIDecision]:
        hikes = []
        for subscription in subscriptions:
            timeline = sorted(subscription.price_timeline, key=lambda item: item["date"])
            if len(timeline) < 2:
                continue
            previous = timeline[0]["amount"]
            latest = timeline[-1]["amount"]
            if previous <= 0 or latest <= previous * 1.05:
                continue
            increase = latest - previous
            increase_percent = round((increase / previous) * 100, 1)
            impact = self._monthly_impact(increase, subscription.frequency)
            hikes.append(
                {
                    "confidence": 0.9,
                    "reasoning": [f"{subscription.merchant} rose from {previous:.2f} to {latest:.2f}."],
                    "explanation": f"{subscription.merchant} increased by {increase_percent}% based on the observed billing timeline.",
                    "recommendations": ["Check plan tier, downgrade, or compare alternatives."],
                    "metadata": {
                        "merchant": subscription.merchant,
                        "previous_amount": previous,
                        "latest_amount": latest,
                        "increase_percent": increase_percent,
                        "monthly_impact": round(impact, 2),
                        "annual_impact": round(impact * 12, 2),
                        "timeline": timeline,
                        "recent_increase": timeline[-1]["date"],
                    },
                }
            )
        return hikes, AIDecision(
            confidence=0.9,
            reasoning=[f"Found {len(hikes)} subscriptions with price increases above 5%."],
            explanation="Price changes were detected from each subscription billing timeline.",
            metadata={"price_hike_count": len(hikes)},
        )

    def _monthly_impact(self, increase: float, frequency: str) -> float:
        factors = {"weekly": 4.33, "monthly": 1, "quarterly": 1 / 3, "yearly": 1 / 12, "irregular": 1}
        return increase * factors.get(frequency, 1)


class DuplicateSubscriptionDetector:
    def detect(self, subscriptions: list[SubscriptionSignal]) -> tuple[list[dict[str, Any]], AIDecision]:
        groups: dict[str, list[SubscriptionSignal]] = defaultdict(list)
        for subscription in subscriptions:
            group = MerchantKnowledgeBase.duplicate_group_for(subscription.merchant)
            if group:
                groups[group].append(subscription)

        duplicates = []
        for group, items in groups.items():
            if len(items) < 2:
                continue
            monthly_spend = sum(self._monthly_amount(item.amount, item.frequency) for item in items)
            keep = max(items, key=lambda item: item.confidence)
            candidates = [item for item in items if item.merchant != keep.merchant]
            duplicates.append(
                {
                    "confidence": round(min(0.94, 0.65 + 0.08 * len(items)), 2),
                    "reasoning": [f"{len(items)} services belong to the same {group.replace('_', ' ')} category."],
                    "explanation": f"{', '.join(item.merchant for item in items)} overlap in purpose; consolidating could reduce recurring spend.",
                    "recommendations": [f"Keep {keep.merchant} if it is most used; cancel or pause {', '.join(item.merchant for item in candidates)}."],
                    "metadata": {
                        "group": group,
                        "merchants": [item.merchant for item in items],
                        "estimated_monthly_overlap": round(monthly_spend - self._monthly_amount(keep.amount, keep.frequency), 2),
                    },
                }
            )

        return duplicates, AIDecision(
            confidence=0.86,
            reasoning=[f"Identified {len(duplicates)} duplicate subscription groups."],
            explanation="Duplicate subscriptions were inferred from services that solve the same user need.",
            metadata={"duplicate_group_count": len(duplicates)},
        )

    def _monthly_amount(self, amount: float, frequency: str) -> float:
        return {"weekly": amount * 4.33, "monthly": amount, "quarterly": amount / 3, "yearly": amount / 12}.get(frequency, amount)


class UnusedSubscriptionDetector:
    def detect(
        self, subscriptions: list[SubscriptionSignal], transactions: list[TransactionRecord]
    ) -> tuple[list[dict[str, Any]], AIDecision]:
        unused = []
        latest_date = max((datetime.fromisoformat(tx.transaction_date) for tx in transactions), default=datetime.now(UTC).replace(tzinfo=None))
        category_activity: dict[str, int] = defaultdict(int)
        for tx in transactions:
            category_activity[tx.category] += 1

        for subscription in subscriptions:
            last_charge = max(datetime.fromisoformat(item["date"]) for item in subscription.price_timeline)
            monthly_cost = DuplicateSubscriptionDetector()._monthly_amount(subscription.amount, subscription.frequency)
            competing_services = len([item for item in subscriptions if item.category == subscription.category and item.merchant != subscription.merchant])
            inactivity_days = (latest_date - last_charge).days
            engagement_score = max(0.0, 1.0 - (0.18 * competing_services) - (0.12 if category_activity[subscription.category] <= subscription.occurrences else 0) - (0.15 if inactivity_days > 45 else 0) - (0.12 if monthly_cost > 25 else 0))
            subscription.unused_score = round(1 - engagement_score, 2)
            if subscription.unused_score < 0.36:
                continue
            unused.append(
                {
                    "confidence": round(min(0.88, 0.48 + subscription.unused_score / 2), 2),
                    "reasoning": [
                        f"Engagement score is {engagement_score:.2f}.",
                        f"{competing_services} competing services detected in {subscription.category}.",
                    ],
                    "explanation": f"{subscription.merchant} may be underused because the portfolio shows overlap or weak related activity.",
                    "recommendations": ["Pause for one billing cycle or verify recent usage before renewal."],
                    "metadata": {
                        "merchant": subscription.merchant,
                        "unused_score": subscription.unused_score,
                        "engagement_score": round(engagement_score, 2),
                        "monthly_cost": round(monthly_cost, 2),
                    },
                }
            )
        return unused, AIDecision(
            confidence=0.72,
            reasoning=[f"Flagged {len(unused)} possibly unused subscriptions from activity, overlap, cost, and recency signals."],
            explanation="Unused subscriptions are inferred signals and should be verified by the user.",
            metadata={"unused_count": len(unused)},
        )


class LeakScoreCalculator:
    def calculate(
        self,
        subscriptions: list[SubscriptionSignal],
        price_hikes: list[dict[str, Any]],
        duplicates: list[dict[str, Any]],
        unused: list[dict[str, Any]],
        transactions: list[TransactionRecord],
    ) -> dict[str, Any]:
        monthly_spend = sum(DuplicateSubscriptionDetector()._monthly_amount(item.amount, item.frequency) for item in subscriptions)
        monthly_waste = sum(item["metadata"].get("monthly_cost", 0) * 0.8 for item in unused)
        monthly_waste += sum(item["metadata"].get("estimated_monthly_overlap", 0) for item in duplicates)
        monthly_waste += sum(item["metadata"].get("monthly_impact", 0) for item in price_hikes)
        growth_score, growth_reason = self._spending_growth(transactions)

        penalties = [
            min(24, len(unused) * 9),
            min(22, len(duplicates) * 12),
            min(16, len(price_hikes) * 7),
            min(18, monthly_spend / 20),
            min(20, max(0, growth_score)),
        ]
        overall = max(0, min(100, round(100 - sum(penalties))))
        breakdown = {
            "unused_subscriptions": max(0, round(100 - penalties[0] * 4)),
            "duplicate_subscriptions": max(0, round(100 - penalties[1] * 4)),
            "price_hikes": max(0, round(100 - penalties[2] * 5)),
            "large_expenses": max(0, round(100 - penalties[3] * 3)),
            "spending_trend": max(0, round(100 - penalties[4] * 3)),
        }
        reasoning = [
            f"Monthly recurring spend is {monthly_spend:.2f}.",
            f"Estimated monthly leak is {monthly_waste:.2f}.",
            growth_reason,
        ]
        if duplicates:
            reasoning.append(f"{len(duplicates)} duplicate subscription group(s) materially reduce the score.")
        if price_hikes:
            reasoning.append(f"{len(price_hikes)} recent price increase(s) add avoidable spend.")

        return {
            "confidence": 0.86 if subscriptions else 0.52,
            "reasoning": reasoning,
            "explanation": f"Leak Score is {overall}/100; higher leak risk comes from unused, duplicate, growing, and recently increased subscriptions.",
            "recommendations": ["Prioritize high-confidence cancellation, downgrade, or bundle recommendations."],
            "metadata": {
                "overall_score": overall,
                "breakdown": breakdown,
                "monthly_recurring_spend": round(monthly_spend, 2),
                "monthly_waste": round(monthly_waste, 2),
                "annual_waste": round(monthly_waste * 12, 2),
                "risk_level": "low" if overall >= 75 else "medium" if overall >= 45 else "high",
                "algorithm_version": "leakguard-intelligence-v1",
            },
        }

    def _spending_growth(self, transactions: list[TransactionRecord]) -> tuple[float, str]:
        monthly: dict[str, float] = defaultdict(float)
        for tx in transactions:
            month = tx.transaction_date[:7]
            monthly[month] += tx.amount
        if len(monthly) < 2:
            return 0.0, "Not enough month-over-month data to calculate spending growth."
        ordered = sorted(monthly.items())
        previous, current = ordered[-2][1], ordered[-1][1]
        if previous <= 0:
            return 0.0, "Previous month spend was unavailable."
        growth = ((current - previous) / previous) * 100
        return max(0, growth / 4), f"Spending changed by {growth:.1f}% from {ordered[-2][0]} to {ordered[-1][0]}."


class RecommendationEngine:
    def generate(
        self,
        subscriptions: list[SubscriptionSignal],
        price_hikes: list[dict[str, Any]],
        duplicates: list[dict[str, Any]],
        unused: list[dict[str, Any]],
    ) -> tuple[list[dict[str, Any]], AIDecision]:
        recommendations = []
        seen = set()

        for item in unused:
            merchant = item["metadata"]["merchant"]
            monthly = item["metadata"]["monthly_cost"]
            recommendations.append(self._recommendation("Pause unused subscription", merchant, "Pause", monthly, "high", item["confidence"], item["explanation"]))
            seen.add((merchant, "Pause"))

        for item in duplicates:
            overlap = item["metadata"]["estimated_monthly_overlap"]
            merchant = ", ".join(item["metadata"]["merchants"])
            recommendations.append(self._recommendation("Consolidate duplicate services", merchant, "Bundle", overlap, "high", item["confidence"], item["explanation"]))

        for item in price_hikes:
            merchant = item["metadata"]["merchant"]
            monthly = item["metadata"]["monthly_impact"]
            if (merchant, "Downgrade") in seen:
                continue
            recommendations.append(self._recommendation("Review recent price increase", merchant, "Downgrade", monthly, "medium", item["confidence"], item["explanation"]))

        for subscription in subscriptions:
            monthly = DuplicateSubscriptionDetector()._monthly_amount(subscription.amount, subscription.frequency)
            if monthly <= 5 or subscription.confidence < 0.72:
                action = "Keep"
                priority = "low"
                savings = 0
                reason = f"{subscription.merchant} is low cost or confidently recurring without strong leak signals."
            else:
                action = "Downgrade"
                priority = "medium"
                savings = monthly * 0.25
                reason = f"{subscription.merchant} is a meaningful recurring cost; a lower tier could preserve value."
            key = (subscription.merchant, action)
            if key not in seen:
                recommendations.append(self._recommendation(f"{action} {subscription.merchant}", subscription.merchant, action, savings, priority, subscription.confidence, reason))
                seen.add(key)

        recommendations.sort(
            key=lambda item: (
                {"high": 0, "medium": 1, "low": 2}[item["metadata"]["priority"]],
                -item["metadata"]["estimated_monthly_savings"],
            )
        )
        return recommendations, AIDecision(
            confidence=0.86 if recommendations else 0.5,
            reasoning=[f"Generated {len(recommendations)} ranked recommendations from leak signals."],
            explanation="Actions were prioritized by savings potential, confidence, and customer impact.",
            metadata={"recommendation_count": len(recommendations)},
        )

    def _recommendation(self, title: str, merchant: str, action: str, monthly_savings: float, priority: str, confidence: float, reason: str) -> dict[str, Any]:
        monthly = round(max(0, monthly_savings), 2)
        return {
            "confidence": round(confidence, 2),
            "reasoning": [reason],
            "explanation": reason,
            "recommendations": [action],
            "metadata": {
                "title": title,
                "merchant": merchant,
                "action": action,
                "estimated_monthly_savings": monthly,
                "estimated_yearly_savings": round(monthly * 12, 2),
                "priority": priority,
                "reason": reason,
            },
        }


class InsightGenerator:
    def generate(
        self,
        transactions: list[TransactionRecord],
        subscriptions: list[SubscriptionSignal],
        leak_score: dict[str, Any],
        recommendations: list[dict[str, Any]],
    ) -> dict[str, Any]:
        monthly: dict[str, float] = defaultdict(float)
        category_spend: dict[str, float] = defaultdict(float)
        for tx in transactions:
            monthly[tx.transaction_date[:7]] += tx.amount
            category_spend[tx.category] += tx.amount
        insights = []
        ordered_months = sorted(monthly.items())
        if len(ordered_months) >= 2 and ordered_months[-2][1] > 0:
            change = ((ordered_months[-1][1] - ordered_months[-2][1]) / ordered_months[-2][1]) * 100
            insights.append(f"You spent {abs(change):.0f}% {'more' if change >= 0 else 'less'} this month.")
        recurring_spend = leak_score["metadata"]["monthly_recurring_spend"]
        annual_waste = leak_score["metadata"]["annual_waste"]
        if subscriptions:
            insights.append(f"Subscriptions now cost about {recurring_spend:.2f}/month across {len(subscriptions)} services.")
        if annual_waste:
            insights.append(f"You can save approximately {annual_waste:.0f}/year by acting on the top LeakGuard recommendations.")
        if category_spend:
            category, spend = max(category_spend.items(), key=lambda item: item[1])
            insights.append(f"{category} spending is your highest category at {spend:.2f}.")
        if recommendations:
            top = recommendations[0]["metadata"]
            insights.append(f"Fastest win: {top['action']} {top['merchant']} for about {top['estimated_yearly_savings']:.0f}/year.")

        return {
            "confidence": 0.84 if insights else 0.45,
            "reasoning": ["Insights were generated from actual transaction totals, recurring spend, and ranked savings actions."],
            "explanation": "Financial insights summarize what changed, what leaks money, and what action matters first.",
            "recommendations": insights,
            "metadata": {"insights": insights},
        }


class FinancialAdvisorEngine:
    def answer(self, question: str, report: dict[str, Any]) -> dict[str, Any]:
        normalized = question.lower()
        recommendations = [self._recommendation_metadata(item) for item in report.get("recommendations", [])]
        subscriptions = report.get("subscriptions", [])
        leak_score = report.get("leak_score", {}).get("metadata", {})
        total_savings = sum(item.get("estimated_monthly_savings", 0) for item in recommendations)

        if "score" in normalized:
            answer = f"Your Leak Score is {leak_score.get('overall_score', 0)}/100. " + " ".join(report.get("leak_score", {}).get("reasoning", []))
        elif "cancel" in normalized or "save" in normalized or "wasting" in normalized:
            top = recommendations[:3]
            actions = "; ".join(f"{item['action']} {item['merchant']} to save {item['estimated_monthly_savings']:.2f}/month" for item in top)
            answer = f"Start with these actions: {actions}. Total identified monthly savings is about {total_savings:.2f}."
        elif "biggest" in normalized or "recurring" in normalized:
            top_subs = sorted(subscriptions, key=lambda item: item.get("amount", 0), reverse=True)[:5]
            answer = "Your biggest recurring expenses are " + ", ".join(f"{item['merchant']} ({item['amount']:.2f}/{item['frequency']})" for item in top_subs) + "."
        else:
            answer = f"I found {len(subscriptions)} recurring payments and about {total_savings:.2f}/month in actionable savings. Ask about cancellations, leak score, or biggest recurring expenses for a sharper answer."

        return {
            "confidence": 0.82 if subscriptions or recommendations else 0.45,
            "reasoning": ["Advisor answer was grounded in the supplied user-specific intelligence report."],
            "explanation": answer,
            "recommendations": [item.get("title", "") for item in recommendations[:3]],
            "metadata": {"answer": answer, "monthly_savings_identified": round(total_savings, 2)},
        }

    def _recommendation_metadata(self, item: dict[str, Any]) -> dict[str, Any]:
        return item.get("metadata", item)


class AIProcessingPipeline:
    def __init__(self, ai_service: GeminiService | None = None):
        self.ai_service = ai_service or gemini_service
        self.extractor = TransactionExtractor()
        self.normalizer = TransactionNormalizer()
        self.recurring_detector = RecurringPaymentDetector()
        self.price_hike_detector = PriceHikeDetector()
        self.duplicate_detector = DuplicateSubscriptionDetector()
        self.unused_detector = UnusedSubscriptionDetector()
        self.leak_score_calculator = LeakScoreCalculator()
        self.recommendation_engine = RecommendationEngine()
        self.insight_generator = InsightGenerator()

    async def process(self, content: str, filename: str) -> dict[str, Any]:
        candidates, extraction_decision = self.extractor.extract(content, filename)
        transactions, cleaning_decision = self.normalizer.normalize(candidates, filename.rsplit(".", 1)[-1].lower() if "." in filename else "text")
        await self._enrich_categories(transactions)
        subscriptions, recurring_decision = self.recurring_detector.detect(transactions)
        price_hikes, price_decision = self.price_hike_detector.detect(subscriptions)
        duplicates, duplicate_decision = self.duplicate_detector.detect(subscriptions)
        unused, unused_decision = self.unused_detector.detect(subscriptions, transactions)
        leak_score = self.leak_score_calculator.calculate(subscriptions, price_hikes, duplicates, unused, transactions)
        recommendations, recommendation_decision = self.recommendation_engine.generate(subscriptions, price_hikes, duplicates, unused)
        insights = self.insight_generator.generate(transactions, subscriptions, leak_score, recommendations)

        return {
            "confidence": round(statistics.mean([extraction_decision.confidence, cleaning_decision.confidence, recurring_decision.confidence, leak_score["confidence"]]), 2),
            "reasoning": [
                extraction_decision.explanation,
                cleaning_decision.explanation,
                recurring_decision.explanation,
                leak_score["explanation"],
            ],
            "explanation": "LeakGuard processed the upload end-to-end into explainable financial intelligence.",
            "recommendations": recommendations,
            "recommendation_summaries": [item["metadata"] for item in recommendations],
            "metadata": {
                "pipeline_version": "2026.07",
                "decisions": {
                    "extraction": asdict(extraction_decision),
                    "cleaning": asdict(cleaning_decision),
                    "recurring_detection": asdict(recurring_decision),
                    "price_hike_detection": asdict(price_decision),
                    "duplicate_detection": asdict(duplicate_decision),
                    "unused_detection": asdict(unused_decision),
                    "recommendation_generation": asdict(recommendation_decision),
                },
            },
            "transactions": [asdict(tx) for tx in transactions],
            "subscriptions": [asdict(subscription) for subscription in subscriptions],
            "price_hikes": price_hikes,
            "unused_subscriptions": unused,
            "duplicate_subscriptions": duplicates,
            "leak_score": leak_score,
            "financial_insights": insights,
        }

    async def _enrich_categories(self, transactions: list[TransactionRecord]) -> None:
        for tx in transactions:
            if tx.confidence >= 0.62:
                continue
            result = await self.ai_service.categorize_transaction(tx.normalized_merchant, tx.amount, tx.transaction_date, tx.description)
            category = result.get("category") if isinstance(result, dict) else None
            confidence = float(result.get("confidence", 0)) if isinstance(result, dict) else 0
            if category and confidence > tx.confidence:
                tx.category = str(category).title()
                tx.confidence = min(0.95, confidence)
                tx.reasoning.append(f"Gemini categorization improved confidence to {confidence:.2f}.")


financial_intelligence_pipeline = AIProcessingPipeline()
financial_advisor_engine = FinancialAdvisorEngine()
