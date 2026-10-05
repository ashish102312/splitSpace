from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import GroupCreate, GroupResponse, JoinGroupRequest
from database import get_db
from dependencies import get_current_user
import uuid
import random
import string
from datetime import datetime

router = APIRouter()

def generate_group_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@router.post("/", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(group: GroupCreate, user_id: str = Depends(get_current_user)):
    db = get_db()
    
    # Generate unique code
    code = generate_group_code()
    while await db.groups.find_one({"code": code}):
        code = generate_group_code()

    group_doc = {
        "id": str(uuid.uuid4()),
        "code": code,
        "name": group.name,
        "description": group.description,
        "created_by": user_id,
        "members": [{"user_id": user_id, "role": "admin", "joined_at": datetime.utcnow()}],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.groups.insert_one(group_doc)
    group_doc.pop("_id", None)
    return group_doc

@router.get("/", response_model=List[GroupResponse])
async def get_user_groups(user_id: str = Depends(get_current_user)):
    db = get_db()
    cursor = db.groups.find({"members.user_id": user_id})
    groups = await cursor.to_list(length=100)
    for g in groups:
        g.pop("_id", None)
    return groups

@router.get("/{group_id}", response_model=GroupResponse)
async def get_group_details(group_id: str, user_id: str = Depends(get_current_user)):
    db = get_db()
    group = await db.groups.find_one({"id": group_id})
    
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
        
    # Check if user is a member
    if not any(m["user_id"] == user_id for m in group["members"]):
        raise HTTPException(status_code=403, detail="Not a member of this group")
        
    group.pop("_id", None)
    return group

@router.post("/join", response_model=GroupResponse)
async def join_group(req: JoinGroupRequest, user_id: str = Depends(get_current_user)):
    db = get_db()
    group = await db.groups.find_one({"code": req.code})
    
    if not group:
        raise HTTPException(status_code=404, detail="Group not found or invalid code")
        
    if any(m["user_id"] == user_id for m in group["members"]):
        raise HTTPException(status_code=400, detail="Already a member of this group")
        
    new_member = {"user_id": user_id, "role": "member", "joined_at": datetime.utcnow()}
    
    await db.groups.update_one(
        {"id": group["id"]},
        {
            "$push": {"members": new_member},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    group = await db.groups.find_one({"id": group["id"]})
    group.pop("_id", None)
    return group
