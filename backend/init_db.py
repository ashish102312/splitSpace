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
    print("Database connection established.")

if __name__ == "__main__":
    init_databases()
