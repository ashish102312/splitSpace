import sys
import time
import uuid
# pyrefly: ignore [missing-import]
import jwt
import requests

# Test configuration
SECRET_KEY = "supersecretjwtkey_replace_me_in_production"
ALGORITHM = "HS256"
EXPENSE_SERVICE_URL = "http://localhost:8003/api/personal-expenses"
GATEWAY_URL = "http://localhost:8000/api/personal-expenses"

def generate_test_token(user_id="test-user-123", email="tester@splitspace.io"):
    payload = {
        "user_id": user_id,
        "email": email,
        "type": "access",
        "exp": time.time() + 3600
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def run_tests():
    print("=" * 60)
    print("🚀 SplitSpace Expense Service - Integration Test Suite")
    print("=" * 60)

    # Determine base url (prefer Gateway if active, else direct service)
    token = generate_test_token(user_id=f"user_{uuid.uuid4().hex[:8]}")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Test connectivity
    target_url = None
    for url, label in [(GATEWAY_URL, "API Gateway (8000)"), (EXPENSE_SERVICE_URL, "Expense Service (8003)")]:
        try:
            res = requests.get(f"{url}/health" if "8003" in url else "http://localhost:8000/health", timeout=2)
            if res.status_code == 200:
                target_url = url
                print(f"✔ Connected via {label}: {target_url}")
                break
        except Exception:
            continue

    if not target_url:
        print(f"ℹ Service not running yet on 8000/8003. Target will be direct: {EXPENSE_SERVICE_URL}")
        target_url = EXPENSE_SERVICE_URL

    print(f"\n1. Testing Expense Creation (POST {target_url}/)...")
    exp1_payload = {
        "title": "Grocery Run at Supermarket",
        "amount": 1450.50,
        "category": "Groceries",
        "payment_method": "Credit Card",
        "notes": "Weekly fruits and household essentials"
    }
    exp2_payload = {
        "title": "Dinner with Colleagues",
        "amount": 820.00,
        "category": "Food & Dining",
        "payment_method": "UPI",
        "notes": "Italian restaurant"
    }
    exp3_payload = {
        "title": "Metro Card Recharge",
        "amount": 500.00,
        "category": "Transportation",
        "payment_method": "UPI",
        "notes": "Monthly transit pass"
    }

    try:
        r1 = requests.post(f"{target_url}/", json=exp1_payload, headers=headers)
        print(f"   Created Expense 1: Status {r1.status_code}")
        assert r1.status_code == 201, f"Expected 201, got {r1.status_code}: {r1.text}"
        exp1_id = r1.json()["id"]

        r2 = requests.post(f"{target_url}/", json=exp2_payload, headers=headers)
        print(f"   Created Expense 2: Status {r2.status_code}")
        assert r2.status_code == 201
        exp2_id = r2.json()["id"]

        r3 = requests.post(f"{target_url}/", json=exp3_payload, headers=headers)
        print(f"   Created Expense 3: Status {r3.status_code}")
        assert r3.status_code == 201
        exp3_id = r3.json()["id"]

        print(f"\n2. Testing List & Filtering (GET {target_url}/)...")
        all_res = requests.get(f"{target_url}/", headers=headers)
        assert all_res.status_code == 200
        items = all_res.json()
        print(f"   Retrieved {len(items)} personal expenses.")
        assert len(items) == 3

        # Test filter by category
        filter_res = requests.get(f"{target_url}/?category=Groceries", headers=headers)
        assert filter_res.status_code == 200
        groceries = filter_res.json()
        print(f"   Filtered by Groceries: {len(groceries)} item(s) found.")
        assert len(groceries) == 1 and groceries[0]["title"] == "Grocery Run at Supermarket"

        print(f"\n3. Testing Expense Update (PUT {target_url}/{exp1_id})...")
        update_res = requests.put(f"{target_url}/{exp1_id}", json={"amount": 1600.00, "notes": "Updated with organic milk"}, headers=headers)
        assert update_res.status_code == 200
        updated = update_res.json()
        print(f"   Updated amount to: ₹{updated['amount']}")
        assert updated["amount"] == 1600.00

        print(f"\n4. Testing Financial Analytics Summary (GET {target_url}/analytics/summary)...")
        analytics_res = requests.get(f"{target_url}/analytics/summary", headers=headers)
        assert analytics_res.status_code == 200
        analytics = analytics_res.json()
        print(f"   Total Spent: ₹{analytics['total_spent']}")
        print(f"   Total Transactions: {analytics['total_transactions']}")
        print(f"   Categories: {len(analytics['categories'])} categories")
        print(f"   Monthly Trends: {len(analytics['monthly_trends'])} months")
        expected_total = 1600.00 + 820.00 + 500.00
        assert abs(analytics["total_spent"] - expected_total) < 0.01
        assert analytics["total_transactions"] == 3

        print(f"\n5. Testing Expense Deletion (DELETE {target_url}/{exp3_id})...")
        del_res = requests.delete(f"{target_url}/{exp3_id}", headers=headers)
        assert del_res.status_code == 200
        print(f"   Deleted Expense 3: {del_res.json()}")

        # Verify count decreased to 2
        after_del = requests.get(f"{target_url}/", headers=headers).json()
        assert len(after_del) == 2
        print(f"   Verified remaining expenses: {len(after_del)}")

        print("\n" + "=" * 60)
        print("🎉 ALL EXPENSE SERVICE INTEGRATION TESTS PASSED SUCCESSFULLY!")
        print("=" * 60)
        return True

    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
