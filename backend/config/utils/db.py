import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGODB_DATABASE", "splitspace")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def get_db():
    return db
