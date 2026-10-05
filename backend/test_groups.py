import requests
import json
import uuid

BASE_URL = "http://localhost:8000/api"

def register(email, password, name):
    res = requests.post(f"{BASE_URL}/auth/register/", json={"email": email, "password": password, "confirmPassword": password, "name": name})
    return res.json()

def login(email, password):
    res = requests.post(f"{BASE_URL}/auth/login/", json={"email": email, "password": password})
    data = res.json()
    try:
        return data["data"]["tokens"]["access"]
    except KeyError:
        raise Exception(f"Login failed: {data}")

def create_group(token, name, desc):
    res = requests.post(f"{BASE_URL}/groups/", json={"name": name, "description": desc}, headers={"Authorization": f"Bearer {token}"})
    return res.json()

def join_group(token, code):
    res = requests.post(f"{BASE_URL}/groups/join", json={"code": code}, headers={"Authorization": f"Bearer {token}"})
    return res.json()

def add_expense(token, group_id, desc, total, paid_by, splits):
    res = requests.post(f"{BASE_URL}/expenses/", json={
        "group_id": group_id,
        "description": desc,
        "total_amount": total,
        "paid_by": paid_by,
        "splits": splits
    }, headers={"Authorization": f"Bearer {token}"})
    return res.json()

print("Registering users...")
id = str(uuid.uuid4())[:6]
u1 = f"alice_{id}@test.com"
u2 = f"bob_{id}@test.com"
u3 = f"charlie_{id}@test.com"

register(u1, "password123", "Alice")
register(u2, "password123", "Bob")
register(u3, "password123", "Charlie")

t1 = login(u1, "password123")
t2 = login(u2, "password123")
t3 = login(u3, "password123")

print("Creating group...")
group = create_group(t1, "Trip to Hawaii", "Vacation expenses")
print(group)
code = group["code"]
print(f"Group created with code: {code}")

print("Joining group...")
res2 = join_group(t2, code)
res3 = join_group(t3, code)

print("Group members:")
members = res3.get("members", [])
for m in members:
    print(f"- {m['user_id']} ({m['role']})")

u1_id = members[0]["user_id"]
u2_id = members[1]["user_id"]
u3_id = members[2]["user_id"]

print("\nAdding an expense of $90 paid by Alice, split equally...")
expense = add_expense(t1, group["id"], "Dinner", 90.0, u1_id, [
    {"user_id": u1_id, "amount": 30.0},
    {"user_id": u2_id, "amount": 30.0},
    {"user_id": u3_id, "amount": 30.0}
])
print(expense)

