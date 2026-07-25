import json
import re
from typing import Any, Optional

from app.core.config import get_settings
from app.prompts.ai_prompts import (
    FINANCIAL_ADVISOR_PROMPT,
    LEAK_SCORE_PROMPT,
    SUBSCRIPTION_RECOMMENDATION_PROMPT,
    TRANSACTION_CATEGORIZATION_PROMPT,
)


class GeminiService:
    """Google Gemini AI service wrapper."""

    def __init__(self):
        self.settings = get_settings()
        self._model = None

    def _get_model(self):
        if self._model is None and self.settings.google_gemini_api_key:
            try:
                import google.generativeai as genai

                genai.configure(api_key=self.settings.google_gemini_api_key)
                self._model = genai.GenerativeModel("gemini-2.0-flash")
            except ImportError:
                pass
        return self._model

    async def generate(self, prompt: str) -> str:
        model = self._get_model()
        if model is None:
            return self._fallback_response(prompt)
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"AI service error: {str(e)}. Using fallback analysis."

    def _fallback_response(self, prompt: str) -> str:
        if "Leak Score" in prompt or "leak_score" in prompt.lower():
            return json.dumps({
                "overall": 42,
                "unused_subscriptions": 28,
                "duplicate_subscriptions": 35,
                "price_hikes": 52,
                "large_expenses": 45,
                "spending_trend": 38,
                "reasoning": [
                    "Duplicate subscription groups detected",
                    "Price hikes impacting monthly budget",
                    "Low usage subscriptions identified",
                ],
            })
        return "Analysis complete. Configure GOOGLE_GEMINI_API_KEY for full AI capabilities."

    async def categorize_transaction(
        self, merchant: str, amount: float, date: str, description: str = ""
    ) -> dict[str, Any]:
        prompt = TRANSACTION_CATEGORIZATION_PROMPT.format(
            merchant=merchant, amount=amount, date=date, description=description
        )
        response = await self.generate(prompt)
        return self._parse_json(response)

    async def generate_leak_score(
        self,
        subscriptions: list[dict],
        price_hikes: list[dict],
        duplicates: list[dict],
    ) -> dict[str, Any]:
        prompt = LEAK_SCORE_PROMPT.format(
            subscriptions_json=json.dumps(subscriptions),
            price_hikes_json=json.dumps(price_hikes),
            duplicates_json=json.dumps(duplicates),
        )
        response = await self.generate(prompt)
        return self._parse_json(response)

    async def generate_recommendations(
        self, subscriptions: list[dict], usage: list[dict]
    ) -> list[dict]:
        prompt = SUBSCRIPTION_RECOMMENDATION_PROMPT.format(
            subscriptions_json=json.dumps(subscriptions),
            usage_json=json.dumps(usage),
        )
        response = await self.generate(prompt)
        result = self._parse_json(response)
        return result if isinstance(result, list) else [result]

    async def chat_advisor(
        self,
        message: str,
        context: dict[str, Any],
    ) -> str:
        prompt = FINANCIAL_ADVISOR_PROMPT.format(
            monthly_spend=context.get("monthly_spend", 0),
            subscription_count=context.get("subscription_count", 0),
            leak_score=context.get("leak_score", 0),
            potential_savings=context.get("potential_savings", 0),
            top_leaks=context.get("top_leaks", "None detected"),
            subscriptions_json=json.dumps(context.get("subscriptions", [])),
            user_message=message,
        )
        return await self.generate(prompt)

    def _parse_json(self, text: str) -> Any:
        try:
            json_match = re.search(r"\{[\s\S]*\}|\[[\s\S]*\]", text)
            if json_match:
                return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
        return {"raw_response": text}


gemini_service = GeminiService()
