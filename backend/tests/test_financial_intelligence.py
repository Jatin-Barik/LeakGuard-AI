import pytest

from app.services.financial_intelligence import financial_advisor_engine, financial_intelligence_pipeline


DEMO_CSV = """Date,Description,Amount,Currency
2026-04-01,NETFLIX.COM 123456,9.99,USD
2026-05-01,Netflix Inc,9.99,USD
2026-06-01,NETFLIX INDIA,12.99,USD
2026-04-03,Spotify Premium,10.99,USD
2026-05-03,Spotify Premium,10.99,USD
2026-06-03,Spotify Premium,10.99,USD
2026-04-04,Apple Music,10.99,USD
2026-05-04,Apple Music,10.99,USD
2026-06-04,Apple Music,10.99,USD
2026-05-15,OpenAI ChatGPT Plus,20.00,USD
2026-06-15,Claude Pro,20.00,USD
"""


@pytest.mark.asyncio
async def test_pipeline_detects_recurring_hikes_duplicates_and_recommendations():
    report = await financial_intelligence_pipeline.process(DEMO_CSV, "demo.csv")

    assert report["transactions"]
    assert {item["merchant"] for item in report["subscriptions"]} >= {"Netflix", "Spotify", "Apple Music"}
    assert any(item["metadata"]["merchant"] == "Netflix" for item in report["price_hikes"])
    assert {item["metadata"]["group"] for item in report["duplicate_subscriptions"]} >= {"music", "ai_assistants"}
    assert report["leak_score"]["metadata"]["overall_score"] < 100
    assert all("confidence" in item and "explanation" in item for item in report["recommendations"])
    assert report["financial_insights"]["metadata"]["insights"]


@pytest.mark.asyncio
async def test_advisor_answers_from_report_data():
    report = await financial_intelligence_pipeline.process(DEMO_CSV, "demo.csv")

    answer = financial_advisor_engine.answer("Where am I wasting money?", report)

    assert answer["confidence"] > 0.7
    assert "save" in answer["metadata"]["answer"].lower()
    assert any(merchant in answer["metadata"]["answer"] for merchant in ("Spotify", "OpenAI", "Netflix"))


@pytest.mark.asyncio
async def test_pipeline_handles_corrupted_json_without_crashing():
    report = await financial_intelligence_pipeline.process("{not valid json", "bad.json")

    assert report["transactions"] == []
    assert report["confidence"] < 0.6
    assert report["metadata"]["decisions"]["extraction"]["recommendations"]
