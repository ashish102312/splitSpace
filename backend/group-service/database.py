# pyrefly: ignore [missing-import]
import os  # type: ignore  # pyrefly: ignore

from motor.motor_asyncio import AsyncIOMotorClient  # type: ignore  # pyrefly: ignore
from dotenv import load_dotenv  # type: ignore  # pyrefly: ignore

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "splitspace_groups")

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

def get_db():
    return db
