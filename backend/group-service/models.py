from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None

class GroupMember(BaseModel):
    user_id: str
    role: str = "member" # admin or member
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class GroupResponse(BaseModel):
    id: str
    code: str
    name: str
    description: Optional[str]
    created_by: str
    members: List[GroupMember]
    created_at: datetime
    updated_at: datetime

class JoinGroupRequest(BaseModel):
    code: str

class Split(BaseModel):
    user_id: str
    amount: float
    paid: bool = False

class ExpenseCreate(BaseModel):
    group_id: str
    description: str
    total_amount: float
    paid_by: str
    splits: List[Split]
    is_settlement: bool = False

class ExpenseResponse(ExpenseCreate):
    id: str
    created_at: datetime

