import os
# pyrefly: ignore [missing-import]
from pymongo import MongoClient
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
AUTH_DB_NAME = os.getenv("AUTH_DB_NAME", "splitspace_auth")
GROUP_DB_NAME = os.getenv("GROUP_DB_NAME", "splitspace_groups")
EXPENSE_DB_NAME = os.getenv("EXPENSE_DB_NAME", "splitspace_expenses")

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

    # 2. Group Database & Collections
    group_db = client[GROUP_DB_NAME]
    if "groups" not in group_db.list_collection_names():
        group_db.create_collection("groups")
    group_db.groups.create_index("code", unique=True)
    group_db.groups.create_index("id", unique=True)
    group_db.groups.create_index("members.user_id")
    print(f"✔ Database '{GROUP_DB_NAME}' initialized with collection 'groups' (indexes: code, id, members.user_id)")

    if "expenses" not in group_db.list_collection_names():
        group_db.create_collection("expenses")
    group_db.expenses.create_index("id", unique=True)
    group_db.expenses.create_index("group_id")
    print(f"✔ Database '{GROUP_DB_NAME}' initialized with collection 'expenses' (indexes: id, group_id)")

    # 3. Expense Service (Personal Expenses) Database & Collections
    expense_db = client[EXPENSE_DB_NAME]
    if "personal_expenses" not in expense_db.list_collection_names():
        expense_db.create_collection("personal_expenses")
    expense_db.personal_expenses.create_index("id", unique=True)
    expense_db.personal_expenses.create_index("user_id")
    expense_db.personal_expenses.create_index("date")
    expense_db.personal_expenses.create_index("category")
    expense_db.personal_expenses.create_index([("user_id", 1), ("date", -1)])
    print(f"✔ Database '{EXPENSE_DB_NAME}' initialized with collection 'personal_expenses' (indexes: id, user_id, date, category)")

    print("\n--- MongoDB Databases Summary ---")
    dbs = client.list_database_names()
    for db_name in [AUTH_DB_NAME, GROUP_DB_NAME, EXPENSE_DB_NAME]:
        if db_name in dbs:
            print(f"📁 {db_name}")
            for col in client[db_name].list_collection_names():
                count = client[db_name][col].count_documents({})
                print(f"   └── {col} ({count} documents)")

if __name__ == "__main__":
    init_databases()
