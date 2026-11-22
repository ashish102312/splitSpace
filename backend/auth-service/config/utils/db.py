import os  # type: ignore  # pyrefly: ignore
from pymongo import MongoClient  # type: ignore  # pyrefly: ignore
from dotenv import load_dotenv  # type: ignore  # pyrefly: ignore

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "splitspace_auth")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def get_db():
    return db
