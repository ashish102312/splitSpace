from django.contrib.auth.hashers import make_password, check_password
from config.utils.db import get_db
from datetime import datetime, timezone
import uuid

class User:
    @staticmethod
    def collection():
        return get_db().users

    @classmethod
    def create(cls, name, email, password, role="USER"):
        collection = cls.collection()
        if collection.find_one({"email": email}):
            raise ValueError("User with this email already exists")

        user_data = {
            "_id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password_hash": make_password(password),
            "role": role,
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        collection.insert_one(user_data)
        return user_data

    @classmethod
    def get_by_email(cls, email):
        return cls.collection().find_one({"email": email})

    @classmethod
    def get_by_id(cls, user_id):
        return cls.collection().find_one({"_id": user_id})

    @classmethod
    def check_password(cls, user_data, raw_password):
        return check_password(raw_password, user_data.get("password_hash"))
