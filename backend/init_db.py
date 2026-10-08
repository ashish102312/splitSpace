import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
AUTH_DB_NAME = os.getenv("AUTH_DB_NAME", "splitspace_auth")
GROUP_DB_NAME = os.getenv("GROUP_DB_NAME", "splitspace_groups")

def init_databases():
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    client = MongoClient(MONGO_URI)
    
    # 1. Auth Database & Collections
    auth_db = client[AUTH_DB_NAME]
    if "users" not in auth_db.list_collection_names():
        auth_db.create_collection("users")
    auth_db.users.create_index("email", unique=True)
    auth_db.users.create_index("id", unique=True)
    print(f"✔ Database '{AUTH_DB_NAME}' initialized with collection 'users' (indexes: email, id)")

if __name__ == "__main__":
    init_databases()
