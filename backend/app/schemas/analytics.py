"""Analytics schemas."""

from pydantic import BaseModel, Field


class DashboardStats(BaseModel):
    total_monthly_spend: float
    active_subscriptions: int
    potential_savings: float
    leak_score: int
    highest_expense: dict[str, str | float]
    biggest_price_increase: dict[str, str | float]
    annual_waste: float
    projected_savings: float


class MonthlySpending(BaseModel):
    month: str
    total: float
    subscriptions: float
    other: float


class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    count: int


class AnalyticsResponse(BaseModel):
    dashboard: DashboardStats
    monthly_spending: list[MonthlySpending]
    category_breakdown: list[CategoryBreakdown]


class AnalyticsEventRequest(BaseModel):
    event_name: str = Field(min_length=1, max_length=64)
    properties: dict = Field(default_factory=dict)
