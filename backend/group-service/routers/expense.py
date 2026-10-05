from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import ExpenseCreate, ExpenseResponse
from database import get_db
from dependencies import get_current_user
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def add_expense(expense: ExpenseCreate, user_id: str = Depends(get_current_user)):
    db = get_db()
    
    # Check if group exists and user is part of it
    group = await db.groups.find_one({"id": expense.group_id})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
        
    if not any(m["user_id"] == user_id for m in group["members"]):
        raise HTTPException(status_code=403, detail="Not a member of this group")
        
    # Validate splits
    total_split = sum(s.amount for s in expense.splits)
    if abs(total_split - expense.total_amount) > 0.01:
        raise HTTPException(status_code=400, detail="Splits must add up to total amount")
        
    expense_doc = expense.model_dump()
    expense_doc["id"] = str(uuid.uuid4())
    expense_doc["created_at"] = datetime.utcnow()
    
    await db.expenses.insert_one(expense_doc)
    expense_doc.pop("_id", None)
    return expense_doc

@router.get("/group/{group_id}", response_model=List[ExpenseResponse])
async def get_group_expenses(group_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    
    group = await db.groups.find_one({"id": group_id})
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
        
    if not any(m["user_id"] == user_id for m in group["members"]):
        raise HTTPException(status_code=403, detail="Not a member of this group")
        
    cursor = db.expenses.find({"group_id": group_id})
    expenses = await cursor.to_list(length=100)
    for e in expenses:
        e.pop("_id", None)
    return expenses
