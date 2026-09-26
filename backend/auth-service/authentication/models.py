import uuid
from datetime import datetime, timezone
# pyrefly: ignore [missing-import]
from django.contrib.auth.hashers import make_password, check_password
from config.utils.db import get_db

class User:
    @staticmethod
    def get_collection():
        return get_db().users

    @classmethod
    def create(cls, name, email, password):
        collection = cls.get_collection()
        if collection.find_one({"email": email}):
            raise ValueError("Email is already in use")

        user_doc = {
            "id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password": make_password(password),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        collection.insert_one(user_doc)
        user_doc.pop('_id', None)
        return user_doc

    @classmethod
    def get_by_email(cls, email):
        doc = cls.get_collection().find_one({"email": email})
        if doc: doc.pop('_id', None)
        return doc

    @classmethod
    def get_by_id(cls, user_id):
        doc = cls.get_collection().find_one({"id": user_id})
        if doc: doc.pop('_id', None)
        return doc

    @classmethod
    def update(cls, user_id, update_data):
        update_data["updated_at"] = datetime.now(timezone.utc)
        if "password" in update_data:
            update_data["password"] = make_password(update_data["password"])
            
        cls.get_collection().update_one({"id": user_id}, {"$set": update_data})
        return cls.get_by_id(user_id)
    
    @classmethod
    def check_password(cls, user_doc, raw_password):
        return check_password(raw_password, user_doc.get("password"))
