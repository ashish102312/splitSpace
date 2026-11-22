# SplitSpace Backend: Architecture, Codebase & Method Specification

Welcome to the comprehensive reference manual for the **SplitSpace** backend. This document provides an exhaustive, production-grade explanation of every microservice, every architectural pattern, every directory, file, class, method, algorithm, and data pipeline in the pure Django + FastAPI microservices backend.

---

## Table of Contents
1. [High-Level Microservices Topology](#1-high-level-microservices-topology)
2. [End-to-End Request Pipeline & Port Allocation](#2-end-to-end-request-pipeline--port-allocation)
3. [Complete Backend File Map](#3-complete-backend-file-map)
4. [API Gateway (FastAPI Reverse Proxy)](#4-api-gateway-fastapi-reverse-proxy)
5. [Authentication Microservice (Django + DRF)](#5-authentication-microservice-django--drf)
6. [Group Microservice (Django + DRF)](#6-group-microservice-django--drf)
7. [The Greedy Debt Settlement Engine (Algorithm Walkthrough)](#7-the-greedy-debt-settlement-engine-algorithm-walkthrough)
8. [Personal Expense & Analytics Microservice (Django + DRF)](#8-personal-expense--analytics-microservice-django--drf)
9. [Database Persistence Models & Collections](#9-database-persistence-models--collections)
10. [Step-by-Step Execution Workflows](#10-step-by-step-execution-workflows)
11. [Troubleshooting, Routing & Port Reference](#11-troubleshooting-routing--port-reference)

---

## 1. High-Level Microservices Topology

SplitSpace is architected as an **independent, distributed microservices network**. Each domain service owns its own database, runtime process, routing table, and security enforcement layer.

```
                           +---------------------------+
                           |  Client Web Application   |
                           |   (React 19 + Tailwind)   |
                           |        Port: 5173         |
                           +-------------+-------------+
                                         |
                                         | HTTP / JSON REST
                                         v
                           +---------------------------+
                           |    API Gateway (FastAPI)  |
                           |        Port: 8000         |
                           +--+--------+------------+--+
                              |        |            |
                /api/auth/*   |        |            |  /api/personal-expenses/*
                              |        | /api/groups/*
                              |        | /api/expenses/*
                              v        v            v
      +-----------------------+  +-----+-----+  +---+-----------------------+
      |      Auth Service     |  |   Group   |  |     Expense Service       |
      |     (Django + DRF)    |  |  Service  |  |      (Django + DRF)       |
      |       Port: 8001      |  | (Django)  |  |        Port: 8003         |
      |                       |  | Port:8002 |  |                           |
      +-----------+-----------+  +-----+-----+  +-------------+-------------+
                  |                    |                      |
                  |                    |                      |
                  v                    v                      v
          +---------------+    +---------------+      +-----------------+
          |    MongoDB    |    |    MongoDB    |      |     MongoDB     |
          |splitspace_auth|    |splitspace_grps|      |splitspace_p_exp |
          +---------------+    +---------------+      +-----------------+
```

---

## 2. End-to-End Request Pipeline & Port Allocation

| Component | Technology | Port | Primary Responsibility | Backing Store |
| :--- | :--- | :--- | :--- | :--- |
| **API Gateway** | FastAPI, Uvicorn, HTTPX | `8000` | Single entry point, CORS multiplexer, stream proxying | Stateless |
| **Auth Service** | Django 5, DRF, PyJWT | `8001` | Registration, credential validation, JWT token issuance | MongoDB (`splitspace_auth`) |
| **Group Service** | Django 5, DRF, PyMongo | `8002` | Group creation, 6-char codes, shared splits, debt minimizer | MongoDB (`splitspace_groups`) |
| **Expense Service** | Django 5, DRF, PyMongo | `8003` | Personal expense CRUD, multi-filter search, analytics | MongoDB (`splitspace_personal_expenses`) |

---

## 3. Complete Backend File Map

```
backend/
├── api-gateway/
│   ├── .env                       # Target service port configurations
│   ├── main.py                    # Gateway app & reverse proxy forwarding engine
│   └── requirements.txt           # fastapi, httpx, uvicorn, python-dotenv
├── auth-service/
│   ├── manage.py                  # Django CLI runner
│   ├── config/
│   │   ├── asgi.py                # ASGI entry point
│   │   ├── settings.py            # Django settings (CORS, JWT auth backend, APPEND_SLASH)
│   │   ├── urls.py                # Mounts /api/auth/ into authentication.urls
│   │   ├── wsgi.py                # WSGI entry point
│   │   └── utils/
│   │       └── db.py              # PyMongo MongoClient connection pool & get_db()
│   ├── authentication/
│   │   ├── auth_backend.py        # Custom DRF JWTAuthentication & AuthenticatedUser class
│   │   ├── models.py              # User document model interface with MongoDB operations
│   │   ├── urls.py                # Regex route bindings supporting optional trailing slashes
│   │   ├── utils.py               # HS256 JWT encoding and decoding utilities
│   │   └── views.py               # RegisterView, LoginView, RefreshTokenView, MeView, Profile
│   └── requirements.txt           # django, djangorestframework, pymongo, pyjwt
├── group-service/
│   ├── manage.py                  # Django CLI runner (port 8002)
│   ├── config/
│   │   ├── settings.py            # Django configuration with DRF and JWT authentication
│   │   ├── urls.py                # Mounts /api/groups/ and /api/expenses/
│   │   ├── wsgi.py / asgi.py      # WSGI/ASGI entry points
│   │   └── utils/
│   │       └── db.py              # MongoDB connector for splitspace_groups database
│   ├── groups_app/
│   │   ├── auth_backend.py        # Token signature decoding & AuthenticatedUser wrapper
│   │   ├── urls_groups.py         # Routes for group list, join, detail, balances
│   │   ├── urls_expenses.py       # Routes for shared group expenses
│   │   └── views.py               # GroupListCreateView, GroupBalancesView, ExpenseListCreateView
│   └── requirements.txt           # django, djangorestframework, pymongo, pyjwt
├── expense-service/
│   ├── manage.py                  # Django CLI runner (port 8003)
│   ├── config/
│   │   ├── settings.py            # Django configuration with DRF and JWT authentication
│   │   ├── urls.py                # Mounts /api/personal-expenses/
│   │   ├── wsgi.py / asgi.py      # WSGI/ASGI entry points
│   │   └── utils/
│   │       └── db.py              # MongoDB connector for splitspace_personal_expenses
│   ├── personal_expenses_app/
│   │   ├── auth_backend.py        # Token verification & request.user injector
│   │   ├── urls.py                # Routes for personal expense CRUD and analytics
│   │   └── views.py               # PersonalExpenseListCreateView, PersonalAnalyticsSummaryView
│   └── requirements.txt           # django, djangorestframework, pymongo, pyjwt
├── init_db.py                     # Sets up unique indexes on email, code, and date
└── seed_demo.py                   # Automated seeder for sample users and group transactions
```

---

## 4. API Gateway (FastAPI Reverse Proxy)

Located at `backend/api-gateway/main.py`, the API Gateway acts as the single public gateway on port `8000`.

### Key Functions & Methods:

#### 1. `forward_request(request: Request, service_url: str, path: str)`
- **Purpose**: Proxies incoming HTTP requests asynchronously to target microservices while sanitizing hop-by-hop headers.
- **Header Sanitization**:
  ```python
  headers = dict(request.headers)
  headers.pop("host", None)
  headers.pop("content-length", None)
  ```
  *Why*: Removing `host` prevents upstream Django services from rejecting requests due to `ALLOWED_HOSTS` mismatches.
- **Asynchronous Execution**: Reads payload via `await request.body()` and dispatches via `await client.request()`.
- **Response Scrubbing**: Removes hop-by-hop response headers (`transfer-encoding`, `content-encoding`, `connection`) before streaming the status code and content back to the browser.
- **Error Handling**: Traps `httpx.RequestError` and translates downstream downtime into `HTTP 503 Service Unavailable`.

#### 2. Reverse Proxy Route Bindings:
- `@app.api_route("/api/auth/{path:path}")` &rarr; Forwards to `http://localhost:8001/api/auth/{path}`
- `@app.api_route("/api/groups/{path:path}")` &rarr; Forwards to `http://localhost:8002/api/groups/{path}`
- `@app.api_route("/api/expenses/{path:path}")` &rarr; Forwards to `http://localhost:8002/api/expenses/{path}`
- `@app.api_route("/api/personal-expenses/{path:path}")` &rarr; Forwards to `http://localhost:8003/api/personal-expenses/{path}`
- `@app.get("/health")` &rarr; Health-check returning `{"status": "ok", "service": "api-gateway"}`.

---

## 5. Authentication Microservice (Django + DRF)

Operating on port `8001`, this service handles user identity, password encryption, and token lifecycle management.

### Key Files & Methods:

### `authentication/models.py`
Defines the `User` document interface over MongoDB (`splitspace_auth.users`).

- **`User.get_collection()`**: Returns the PyMongo collection `db.users`.
- **`User.create(name, email, password)`**:
  - Checks if `email` is already present. Raises `ValueError("Email is already in use")` on conflict.
  - Calls `django.contrib.auth.hashers.make_password(password)` to generate a salted PBKDF2-SHA256 cryptographic hash.
  - Generates a UUID4 identifier.
  - Persists UTC timestamps for `created_at` and `updated_at`.
  - Removes MongoDB internal `_id` before returning document.
- **`User.get_by_email(email)`**: Queries MongoDB with `{"email": email}`, sanitizes `_id`, and returns user dict.
- **`User.get_by_id(user_id)`**: Queries MongoDB with `{"id": user_id}`.
- **`User.update(user_id, update_data)`**: Updates fields via `collection.update_one({"id": user_id}, {"$set": update_data})`. If updating password, automatically hashes it with `make_password`.
- **`User.check_password(user_doc, raw_password)`**: Uses Django's `check_password(raw_password, user_doc.get("password"))` for verification.

### `authentication/utils.py`
- **`generate_tokens(user_id)`**:
  - Creates **Access Token**: payload `{"user_id": user_id, "exp": now + 60m, "type": "access"}` signed via `HS256`.
  - Creates **Refresh Token**: payload `{"user_id": user_id, "exp": now + 7 days, "type": "refresh"}`.
  - Returns `{"access": access_token, "refresh": refresh_token}`.
- **`decode_token(token, token_type=None)`**:
  - Validates cryptographic signature and expiration timestamp.
  - Validates `payload.get("type") == token_type`.
  - Catches `ExpiredSignatureError` and `InvalidTokenError`, returning `None`.

### `authentication/auth_backend.py`
- **`AuthenticatedUser(dict)`**: Wrapper around user dictionary that returns `True` for `.is_authenticated`.
- **`JWTAuthentication.authenticate(request)`**:
  - Inspects `request.headers.get('Authorization')`.
  - Checks for `Bearer <token>` format.
  - Decodes token, fetches user from database, strips password, and sets `request.user`.

### `authentication/views.py`
- **`RegisterView.post(request)`**: Validates presence of `name`, `email`, `password`, `confirmPassword`, checks regex for valid email format, ensures minimum length of 6 characters, and creates user.
- **`LoginView.post(request)`**: Validates email and password, checks PBKDF2 hash, and returns `{"user": user_data, "tokens": tokens}`.
- **`RefreshTokenView.post(request)`**: Decodes refresh token, validates user existence, and mints a fresh token pair.
- **`MeView.get(request)`**: Returns sanitized authenticated user profile (`request.user`).
- **`UpdateProfileView.put(request)`**: Updates display name for `request.user['id']`.
- **`ChangePasswordView.post(request)`**: Verifies `currentPassword`, validates `newPassword`, and hashes updated password.
- **`LogoutView.post(request)`**: Returns success response (prepared for token blacklisting).

---

## 6. Group Microservice (Django + DRF)

Operating on port `8002`, this service manages group spaces, 6-character invite codes, and shared expense logs.

### Key Files & Methods in `groups_app/views.py`:

#### 1. `generate_group_code(length=6)`
Generates uppercase alphanumeric tokens (e.g. `DGVSBL`, `X8K9Q2`) using `random.choices(string.ascii_uppercase + string.digits, k=6)`.

#### 2. `GroupListCreateView`
- **`get(request)`**: Queries `db.groups.find({"members.user_id": user_id})`. Returns all spaces where user is a participant. Ensures `invite_code` fallback is always populated.
- **`post(request)`**: Generates a collision-free 6-character code, creates a space document with the user as `role: "admin"`, and inserts into `splitspace_groups.groups`.

#### 3. `GroupDetailView`
- **`get(request, group_id)`**: Verifies space existence and confirms that `request.user['id']` is present in the `members` array. Returns full group metadata.

#### 4. `JoinGroupView`
- **`post(request)`**:
  - Sanitizes input code (`clean_code = code.strip().upper()`).
  - Queries `{"$or": [{"code": clean_code}, {"invite_code": clean_code}]}`.
  - Verifies applicant is not already in `members`.
  - Atomically appends new member via MongoDB `$push`:
    ```python
    db.groups.update_one(
        {"id": group["id"]},
        {"$push": {"members": {"user_id": user_id, "role": "member", "joined_at": now}}}
    )
    ```

#### 5. `ExpenseListCreateView`
- **`post(request)`**:
  - Validates presence of `group_id`, `description`, `total_amount`, `splits`.
  - Verifies that `sum(split['amount'])` equals `total_amount` within 0.01 tolerance.
  - Inserts expense record into `splitspace_groups.expenses`.
  - Supports debt settlement markers via `is_settlement: bool`.

#### 6. `GroupExpensesListView`
- **`get(request, group_id)`**: Returns all expenses for a space sorted by `created_at` descending.

---

## 7. The Greedy Debt Settlement Engine (Algorithm Walkthrough)

Located in `GroupBalancesView.get()` in `groups_app/views.py`, this engine computes net balances and optimizes settlements.

### Mathematical Walkthrough:

#### Step 1: Net Balance Aggregation
For each member $m$, net balance $B(m)$ is initialized to $0.00$.
- For every expense $E$:
  - The payer gains credit: $B(\text{paid\_by}) \leftarrow B(\text{paid\_by}) + E_{\text{total}}$
  - Every split participant incurs debt: $B(\text{split\_user}) \leftarrow B(\text{split\_user}) - E_{\text{split\_amount}}$

#### Step 2: Debtor & Creditor Partitioning
- **Debtors** ($B(m) < -0.01$): Members who owe money.
- **Creditors** ($B(m) > +0.01$): Members who are owed money.

Both groups are sorted in descending order of absolute magnitude:
```python
debtors.sort(key=lambda x: x["amount"], reverse=True)
creditors.sort(key=lambda x: x["amount"], reverse=True)
```

#### Step 3: Two-Pointer Greedy Settlement
```python
debts = []
i, j = 0, 0

while i < len(debtors) and j < len(creditors):
    debtor = debtors[i]
    creditor = creditors[j]
    
    # Discharge the maximum possible obligation in a single transfer
    settle_amount = min(debtor["amount"], creditor["amount"])
    
    debts.append({
        "from_user": debtor["user_id"],
        "to_user": creditor["user_id"],
        "amount": round(settle_amount, 2)
    })
    
    debtor["amount"] -= settle_amount
    creditor["amount"] -= settle_amount
    
    if debtor["amount"] < 0.01:
        i += 1
    if creditor["amount"] < 0.01:
        j += 1
```

*Result*: Collapses $O(N^2)$ multi-party debt webs into at most $N-1$ direct transfers.

---

## 8. Personal Expense & Analytics Microservice (Django + DRF)

Operating on port `8003`, this service handles individual spending ledgers and analytical calculations.

### Key Methods in `personal_expenses_app/views.py`:

#### 1. `PersonalExpenseListCreateView`
- **`get(request)`**: Composable search and filtering:
  - Exact category matching (`category != "All"`).
  - Case-insensitive regex substring search on title: `{"title": {"$regex": search, "$options": "i"}}`.
  - Date boundary filtering (`$gte` start date, `$lte` end date).
  - Returns formatted ISO date strings.
- **`post(request)`**: Validates `title` and `amount`. Persists record to `splitspace_personal_expenses.personal_expenses`.

#### 2. `PersonalExpenseDetailView`
- **`get(request, expense_id)`**: Fetches expense by UUID scoped to `user_id`.
- **`put(request, expense_id)`**: Partial updates via `$set` with updated timestamp.
- **`delete(request, expense_id)`**: Scoped deletion by ID and `user_id`.

#### 3. `PersonalAnalyticsSummaryView.get(request)`
Computes summary metrics for the dashboard:
- **`total_spent`**: Cumulative sum of all expenses.
- **`this_month_spent`**: Sum of expenses matching current year and current month.
- **`last_month_spent`**: Sum of expenses matching previous month.
- **`change_pct`**: Month-over-month percentage change:
  $$\Delta\% = \frac{\text{This Month} - \text{Last Month}}{\text{Last Month}} \times 100$$
- **`average_daily_spent`**: Current month expenditure divided by elapsed days in month.
- **`categories`**: Array of categories with spent amount, count, and percentage share.
- **`monthly_trends`**: 6-month historical expenditure array for bar/line charts.

---

## 9. Database Persistence Models & Collections

### 1. `splitspace_auth.users`
```json
{
  "id": "91fc299d-5499-4c98-88cc-70e635972908",
  "name": "Demo User",
  "email": "demo@splitspace.io",
  "password": "pbkdf2_sha256$870000$salt...$hash...",
  "created_at": "2026-11-22T12:45:10.049Z",
  "updated_at": "2026-11-22T12:45:10.049Z"
}
```

### 2. `splitspace_groups.groups`
```json
{
  "id": "177bc9c7-396c-4a10-a82e-713228f44aef",
  "code": "E1G0TA",
  "invite_code": "E1G0TA",
  "name": "Manali Trek",
  "description": "Adventure Split",
  "created_by": "91fc299d-5499-4c98-88cc-70e635972908",
  "members": [
    {
      "user_id": "91fc299d-5499-4c98-88cc-70e635972908",
      "role": "admin",
      "joined_at": "2026-11-22T12:45:36.756Z"
    }
  ],
  "created_at": "2026-11-22T12:45:36.756Z",
  "updated_at": "2026-11-22T12:45:36.756Z"
}
```

### 3. `splitspace_groups.expenses`
```json
{
  "id": "e5c2b1a0-9d8f-4e7c-b6a5-0f1e2d3c4b5a",
  "group_id": "177bc9c7-396c-4a10-a82e-713228f44aef",
  "description": "Campsite Booking",
  "total_amount": 3000.00,
  "paid_by": "91fc299d-5499-4c98-88cc-70e635972908",
  "splits": [
    { "user_id": "91fc299d-5499-4c98-88cc-70e635972908", "amount": 1500.00, "paid": true },
    { "user_id": "37701627-275c-4263-9629-001934686bc6", "amount": 1500.00, "paid": false }
  ],
  "is_settlement": false,
  "created_at": "2026-11-22T12:50:00.000Z"
}
```

### 4. `splitspace_personal_expenses.personal_expenses`
```json
{
  "id": "34f2966e-2ad0-42f2-a1fa-891eb3354aea",
  "user_id": "91fc299d-5499-4c98-88cc-70e635972908",
  "title": "Camping Tent",
  "amount": 1500.00,
  "category": "Travel",
  "date": "2026-11-22T12:45:45.288Z",
  "payment_method": "UPI",
  "notes": null,
  "created_at": "2026-11-22T12:45:45.288Z",
  "updated_at": "2026-11-22T12:45:45.288Z"
}
```

---

## 10. Step-by-Step Execution Workflows

### Workflow 1: User Registration & Login
1. Client POSTs credentials to `http://localhost:8000/api/auth/register`.
2. API Gateway forwards to Auth Service (`8001`).
3. `RegisterView` validates fields, checks uniqueness, and hashes password using PBKDF2-SHA256.
4. User document is inserted into `splitspace_auth.users`.
5. On subsequent login, `LoginView` verifies password and returns JWT access (60 min) and refresh (7 days) tokens.

### Workflow 2: Creating and Joining Group Spaces
1. User creates a group &rarr; Gateway forwards to `Group Service` (`POST /api/groups/`).
2. `generate_group_code()` ensures a unique 6-character uppercase alphanumeric code.
3. User document is stored with creator as `role: "admin"`.
4. Peer user inputs invite code &rarr; Gateway forwards to `POST /api/groups/join`.
5. `JoinGroupView` strips/uppercases code, verifies group existence, checks for existing membership, and executes `$push` to add new member.

### Workflow 3: Shared Expense Splitting & Debt Resolution
1. User submits an expense with split allocations to `POST /api/expenses/`.
2. Group Service checks membership and verifies splits sum up to `total_amount`.
3. Client navigates to `/balances` &rarr; invokes `GroupBalancesView`.
4. Service sums paid amounts and owed splits for every member, separates debtors from creditors, and runs the greedy two-pointer minimizer.
5. Client renders net balances and optimized debt transfers.
6. When a debtor settles up, an expense record with `is_settlement: true` is saved, reconciling the debt balance.

---

## 11. Troubleshooting, Routing & Port Reference

### Port Mapping & Commands

```bash
# 1. API Gateway (Port 8000)
cd backend/api-gateway
source ../expense-service/venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 2. Auth Service (Port 8001)
cd backend/auth-service
source venv/bin/activate
python manage.py runserver 0.0.0.0:8001

# 3. Group Service (Port 8002)
cd backend/group-service
source ../auth-service/venv/bin/activate
python manage.py runserver 0.0.0.0:8002

# 4. Expense Service (Port 8003)
cd backend/expense-service
source ../auth-service/venv/bin/activate
python manage.py runserver 0.0.0.0:8003

# 5. Frontend Client (Port 5173)
cd frontend
npm run dev
```

### URL Normalization & Trailing Slash Support
All Django microservice routes use regex paths (`re_path(r'^...?/?$')`) and have `APPEND_SLASH = False` configured in `settings.py`. This ensures seamless compatibility with the API Gateway regardless of whether endpoints are called with or without trailing slashes.
