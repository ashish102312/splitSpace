# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class PersonalExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str = "Food & Dining"
    date: Optional[datetime] = None
    payment_method: str = "Credit Card"
    notes: Optional[str] = None

class PersonalExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[datetime] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class PersonalExpenseResponse(BaseModel):
    id: str
    user_id: str
    title: str
    amount: float
    category: str
    date: datetime
    payment_method: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class CategoryBreakdown(BaseModel):
    category: str
    total_amount: float
    percentage: float
    count: int

class MonthlyTrend(BaseModel):
    month: str
    month_label: str
    total_amount: float
    count: int

class AnalyticsSummary(BaseModel):
    total_spent: float
    this_month_spent: float
    last_month_spent: float
    change_pct: float
    average_daily_spent: float
    total_transactions: int
    categories: List[CategoryBreakdown]
    payment_method_breakdown: Dict[str, float] = Field(default_factory=dict)
    monthly_trends: List[MonthlyTrend]
    recent_expenses: List[PersonalExpenseResponse]
