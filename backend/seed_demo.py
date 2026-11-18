import requests

BASE_URL = "http://localhost:8000/api"

def seed():
    print("Seeding demo account...")
    email = "demo@splitspace.io"
    password = "password123"
    name = "Alex Morgan"

    # Register (ignore if already registered)
    requests.post(f"{BASE_URL}/auth/register/", json={
        "name": name,
        "email": email,
        "password": password,
        "confirmPassword": password
    })

    # Login
    res = requests.post(f"{BASE_URL}/auth/login/", json={
        "email": email,
        "password": password
    })
    data = res.json()
    if not data.get("success"):
        print(f"Login failed: {data}")
        return
    token = data["data"]["tokens"]["access"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Seed personal expenses
    sample_expenses = [
        {"title": "Organic Produce & Groceries", "amount": 1850.00, "category": "Groceries", "payment_method": "Credit Card", "notes": "Whole Foods weekly restock"},
        {"title": "Team Dinner at Bistro", "amount": 2400.00, "category": "Food & Dining", "payment_method": "UPI", "notes": "Dinner with engineering team"},
        {"title": "Monthly Transit Pass", "amount": 950.00, "category": "Transportation", "payment_method": "UPI", "notes": "Metro smartcard recharge"},
        {"title": "High-Speed Fiber Internet", "amount": 1299.00, "category": "Utilities & Bills", "payment_method": "Net Banking", "notes": "Monthly gigabit plan"},
        {"title": "Ergonomic Desk Accessories", "amount": 3200.00, "category": "Shopping", "payment_method": "Credit Card", "notes": "Monitor arm & desk mat"}
    ]

    for exp in sample_expenses:
        requests.post(f"{BASE_URL}/personal-expenses/", json=exp, headers=headers)

    # Seed a group
    group_res = requests.post(f"{BASE_URL}/groups/", json={
        "name": "Weekend Trip to Tahoe",
        "description": "Cabin rental, ski passes, and shared dinners"
    }, headers=headers).json()
    
    group_id = group_res.get("id")
    if group_id:
        print(f"Created demo group: {group_id}")
        # Add a group expense
        requests.post(f"{BASE_URL}/expenses/", json={
            "group_id": group_id,
            "description": "Lakeside Cabin Rental Deposit",
            "total_amount": 6000.00,
            "paid_by": data["data"]["user"]["id"],
            "splits": [
                {"user_id": data["data"]["user"]["id"], "amount": 6000.00}
            ]
        }, headers=headers)

    print("Demo account seeded successfully!")

if __name__ == "__main__":
    seed()
