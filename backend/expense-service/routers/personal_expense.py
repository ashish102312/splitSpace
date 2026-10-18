from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import calendar

from database import get_db
from dependencies import get_current_user
from models import (
    PersonalExpenseCreate,
    PersonalExpenseUpdate,
    PersonalExpenseResponse,
    CategoryBreakdown,
    MonthlyTrend,
    AnalyticsSummary,
)

router = APIRouter()

@router.post("/", response_model=PersonalExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: PersonalExpenseCreate, user_id: str = Depends(get_current_user)):
    db = get_db()
    
    expense_date = expense.date if expense.date else datetime.utcnow()
    now = datetime.utcnow()
    
    expense_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": expense.title.strip(),
        "amount": round(float(expense.amount), 2),
        "category": expense.category,
        "date": expense_date,
        "payment_method": expense.payment_method,
        "notes": expense.notes.strip() if expense.notes else None,
        "created_at": now,
        "updated_at": now
    }
    
    await db.personal_expenses.insert_one(expense_doc)
    expense_doc.pop("_id", None)
    return expense_doc

@router.get("/", response_model=List[PersonalExpenseResponse])
async def list_expenses(
    category: Optional[str] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    query = {"user_id": user_id}
    
    if category and category != "All":
        query["category"] = category
        
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
        
    if start_date or end_date:
        date_query = {}
        if start_date:
            try:
                date_query["$gte"] = datetime.fromisoformat(start_date)
            except ValueError:
                pass
        if end_date:
            try:
                date_query["$lte"] = datetime.fromisoformat(end_date)
            except ValueError:
                pass
        if date_query:
            query["date"] = date_query
            
    cursor = db.personal_expenses.find(query).sort("date", -1)
    expenses = await cursor.to_list(length=500)
    for exp in expenses:
        exp.pop("_id", None)
    return expenses

@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(user_id: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.personal_expenses.find({"user_id": user_id}).sort("date", -1)
    expenses = await cursor.to_list(length=2000)
    for exp in expenses:
        exp.pop("_id", None)
        
    now = datetime.utcnow()
    current_year = now.year
    current_month = now.month
    
    # Previous month calculation
    if current_month == 1:
        prev_month = 12
        prev_year = current_year - 1
    else:
        prev_month = current_month - 1
        prev_year = current_year
        
    total_spent = 0.0
    this_month_spent = 0.0
    last_month_spent = 0.0
    category_totals = {}
    category_counts = {}
    payment_totals = {}
    
    for exp in expenses:
        amt = float(exp.get("amount", 0.0))
        total_spent += amt
        
        exp_date = exp.get("date")
        if isinstance(exp_date, datetime):
            if exp_date.year == current_year and exp_date.month == current_month:
                this_month_spent += amt
            elif exp_date.year == prev_year and exp_date.month == prev_month:
                last_month_spent += amt
                
        cat = exp.get("category", "Other")
        category_totals[cat] = category_totals.get(cat, 0.0) + amt
        category_counts[cat] = category_counts.get(cat, 0) + 1

        pm = exp.get("payment_method", "Other")
        payment_totals[pm] = round(payment_totals.get(pm, 0.0) + amt, 2)

    total_spent = round(total_spent, 2)
    this_month_spent = round(this_month_spent, 2)
    last_month_spent = round(last_month_spent, 2)
    
    if last_month_spent > 0:
        change_pct = round(((this_month_spent - last_month_spent) / last_month_spent) * 100, 1)
    else:
        change_pct = 0.0
        
    days_in_month = max(1, now.day)
    avg_daily = round(this_month_spent / days_in_month, 2)
    
    # Categories breakdown
    categories_list = []
    for cat, amt in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        pct = round((amt / total_spent * 100), 1) if total_spent > 0 else 0.0
        categories_list.append(CategoryBreakdown(
            category=cat,
            total_amount=round(amt, 2),
            percentage=pct,
            count=category_counts.get(cat, 0)
        ))
        
    # Monthly trends (last 6 months)
    monthly_trends = []
    for i in range(5, -1, -1):
        target_month_date = now - timedelta(days=i * 30)
        t_year = target_month_date.year
        t_month = target_month_date.month
        month_key = f"{t_year:04d}-{t_month:02d}"
        month_label = f"{calendar.month_abbr[t_month]} {t_year}"
        
        m_total = sum(
            float(e["amount"]) for e in expenses
            if isinstance(e.get("date"), datetime) and e["date"].year == t_year and e["date"].month == t_month
        )
        m_count = sum(
            1 for e in expenses
            if isinstance(e.get("date"), datetime) and e["date"].year == t_year and e["date"].month == t_month
        )
        
        monthly_trends.append(MonthlyTrend(
            month=month_key,
            month_label=month_label,
            total_amount=round(m_total, 2),
            count=m_count
        ))
        
    recent_expenses = expenses[:5]
    
    return AnalyticsSummary(
        total_spent=total_spent,
        this_month_spent=this_month_spent,
        last_month_spent=last_month_spent,
        change_pct=change_pct,
        average_daily_spent=avg_daily,
        total_transactions=len(expenses),
        categories=categories_list,
        payment_method_breakdown=payment_totals,
        monthly_trends=monthly_trends,
        recent_expenses=recent_expenses
    )

@router.get("/{expense_id}", response_model=PersonalExpenseResponse)
async def get_expense(expense_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    exp = await db.personal_expenses.find_one({"id": expense_id, "user_id": user_id})
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    exp.pop("_id", None)
    return exp

@router.put("/{expense_id}", response_model=PersonalExpenseResponse)
async def update_expense(
    expense_id: str,
    payload: PersonalExpenseUpdate,
    user_id: str = Depends(get_current_user)
):
    db = get_db()
    existing = await db.personal_expenses.find_one({"id": expense_id, "user_id": user_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        existing.pop("_id", None)
        return existing
        
    if "amount" in update_data:
        update_data["amount"] = round(float(update_data["amount"]), 2)
    if "title" in update_data:
        update_data["title"] = update_data["title"].strip()
    if "notes" in update_data and update_data["notes"]:
        update_data["notes"] = update_data["notes"].strip()
        
    update_data["updated_at"] = datetime.utcnow()
    
    await db.personal_expenses.update_one(
        {"id": expense_id, "user_id": user_id},
        {"$set": update_data}
    )
    
    updated = await db.personal_expenses.find_one({"id": expense_id, "user_id": user_id})
    updated.pop("_id", None)
    return updated

@router.delete("/{expense_id}")
async def delete_expense(expense_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    res = await db.personal_expenses.delete_one({"id": expense_id, "user_id": user_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"success": True, "message": "Expense deleted successfully"}
