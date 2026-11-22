# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field  # type: ignore  # pyrefly: ignore
from typing import List, Optional  # type: ignore  # pyrefly: ignore
from datetime import datetime  # type: ignore  # pyrefly: ignore

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
    invite_code: Optional[str] = None
    name: str
    description: Optional[str]
    created_by: str
    members: List[GroupMember]
    created_at: datetime
    updated_at: datetime

    def model_post_init(self, __context):
        if not self.invite_code and self.code:
            self.invite_code = self.code

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

