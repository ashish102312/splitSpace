# SplitSpace — API Reference

All requests route through the FastAPI API Gateway at `http://localhost:8000/api`.

---

## 🔐 Authentication Service (`/api/auth/*`)

### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register/`
- **Auth**: None
- **Request Body**:
```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "e2a36ac0-...",
      "name": "Alex Morgan",
      "email": "alex@example.com",
      "created_at": "2026-10-18T17:00:00Z"
    }
  }
}
```

### 2. Login User
- **Method**: `POST`
- **Endpoint**: `/api/auth/login/`
- **Auth**: None
- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "e2a36ac0-...",
      "name": "Alex Morgan",
      "email": "alex@example.com"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 3. Refresh Access Token
- **Method**: `POST`
- **Endpoint**: `/api/auth/token/refresh/`
- **Auth**: None
- **Request Body**: `{ "refresh": "<refresh_token>" }`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 4. Get Current User Profile
- **Method**: `GET`
- **Endpoint**: `/api/auth/me/`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
{
  "id": "e2a36ac0-...",
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "created_at": "2026-10-18T17:00:00Z"
}
```

---

## 👥 Group Service (`/api/groups/*`)

### 1. Create Group
- **Method**: `POST`
- **Endpoint**: `/api/groups/`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "name": "Weekend Trip to Tahoe",
  "description": "Cabin rental and ski passes"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "9f54aed6-...",
  "code": "A9K2L1",
  "name": "Weekend Trip to Tahoe",
  "description": "Cabin rental and ski passes",
  "created_by": "user_id_1",
  "members": [
    { "user_id": "user_id_1", "role": "admin", "joined_at": "2026-10-18T17:00:00Z" }
  ],
  "created_at": "2026-10-18T17:00:00Z",
  "updated_at": "2026-10-18T17:00:00Z"
}
```

### 2. Join Group with 6-Character Code
- **Method**: `POST`
- **Endpoint**: `/api/groups/join`
- **Auth**: Bearer Token
- **Request Body**: `{ "code": "A9K2L1" }`
- **Response** (`200 OK`): Group document with user added to `members`.

### 3. Calculate Balances & Debt Settlements
- **Method**: `GET`
- **Endpoint**: `/api/groups/{group_id}/balances`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
{
  "balances": {
    "user_alice": 60.0,
    "user_bob": -30.0,
    "user_charlie": -30.0
  },
  "debts": [
    { "from_user": "user_bob", "to_user": "user_alice", "amount": 30.0 },
    { "from_user": "user_charlie", "to_user": "user_alice", "amount": 30.0 }
  ]
}
```

---

## 💸 Group Expenses (`/api/expenses/*`)

### 1. Add Group Expense or Record Settlement
- **Method**: `POST`
- **Endpoint**: `/api/expenses/`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "group_id": "9f54aed6-...",
  "description": "Dinner at Bistro",
  "total_amount": 90.0,
  "paid_by": "user_alice",
  "splits": [
    { "user_id": "user_alice", "amount": 30.0 },
    { "user_id": "user_bob", "amount": 30.0 },
    { "user_id": "user_charlie", "amount": 30.0 }
  ],
  "is_settlement": false
}
```
- **Response** (`201 Created`):
```json
{
  "id": "277a0c1e-...",
  "group_id": "9f54aed6-...",
  "description": "Dinner at Bistro",
  "total_amount": 90.0,
  "paid_by": "user_alice",
  "splits": [ ... ],
  "is_settlement": false,
  "created_at": "2026-10-18T17:00:00Z"
}
```

---

## 💳 Personal Expenses & Analytics (`/api/personal-expenses/*`)

### 1. Create Personal Expense
- **Method**: `POST`
- **Endpoint**: `/api/personal-expenses/`
- **Auth**: Bearer Token
- **Request Body**:
```json
{
  "title": "Grocery Shopping",
  "amount": 1450.50,
  "category": "Groceries",
  "payment_method": "Credit Card",
  "notes": "Weekly produce and pantry items",
  "date": "2026-10-18T12:00:00Z"
}
```
- **Response** (`201 Created`):
```json
{
  "id": "ede652df-...",
  "user_id": "user_alex",
  "title": "Grocery Shopping",
  "amount": 1450.5,
  "category": "Groceries",
  "payment_method": "Credit Card",
  "notes": "Weekly produce and pantry items",
  "date": "2026-10-18T12:00:00Z",
  "created_at": "2026-10-18T17:00:00Z",
  "updated_at": "2026-10-18T17:00:00Z"
}
```

### 2. List & Filter Personal Expenses
- **Method**: `GET`
- **Endpoint**: `/api/personal-expenses/?category=Groceries&search=Shopping`
- **Auth**: Bearer Token
- **Response** (`200 OK`): Array of personal expense objects matching filters.

### 3. Financial Analytics Summary
- **Method**: `GET`
- **Endpoint**: `/api/personal-expenses/analytics/summary`
- **Auth**: Bearer Token
- **Response** (`200 OK`):
```json
{
  "total_spent": 9700.0,
  "this_month_spent": 9700.0,
  "last_month_spent": 0.0,
  "change_pct": 0.0,
  "average_daily_spent": 538.89,
  "total_transactions": 5,
  "categories": [
    { "category": "Shopping", "total_amount": 3200.0, "percentage": 33.0, "count": 1 },
    { "category": "Food & Dining", "total_amount": 2400.0, "percentage": 24.7, "count": 1 },
    { "category": "Groceries", "total_amount": 1850.0, "percentage": 19.1, "count": 1 }
  ],
  "payment_method_breakdown": {
    "Credit Card": 5050.0,
    "UPI": 3350.0,
    "Net Banking": 1299.0
  },
  "monthly_trends": [
    { "month": "2026-10", "month_label": "Oct 2026", "total_amount": 9700.0, "count": 5 }
  ],
  "recent_expenses": [ ... ]
}
```
