# SplitSpace Backend Architecture & Technical Guide

Welcome to the comprehensive technical documentation for the **SplitSpace** backend. This document provides an exhaustive, production-grade explanation of the entire backend system: every microservice, every architectural pattern, every file, class, method, function, and end-to-end request workflow.

---

## 1. Executive Architecture Overview

SplitSpace employs a decoupled **Polyglot Microservices Architecture** designed for horizontal scalability, zero-downtime deployments, fault tolerance, and secure inter-service communication.

```
                    +---------------------------+
                    |   Frontend Application    |
                    | (React 19 + TailwindCSS)  |
                    +-------------+-------------+
                                  |
                           HTTP / REST API
                                  |
                                  v
                    +---------------------------+
                    |    API Gateway (FastAPI)  |
                    |      Port: 8000           |
                    +--+--------+------------+--+
                       |        |            |
         /api/auth/*   |        |            |  /api/personal-expenses/*
                       |        | /api/groups/*
                       |        | /api/expenses/*
                       v        v            v
           +-----------+  +-----+-----+  +---+--------------------+
           |  Auth     |  |   Group   |  |   Expense Service      |
           |  Service  |  |  Service  |  |  (Personal Expenses &  |
           |  (Django) |  | (FastAPI) |  |   Analytics - FastAPI) |
           | Port:8001 |  | Port:8002 |  |       Port: 8003       |
           +-----+-----+  +-----+-----+  +---+--------------------+
                 |              |            |
                 +-------+------+------------+
                         |
                         v
                +-------------------+
                |  MongoDB Database |
                | splitspace_auth   |
                | splitspace_groups |
                | splitspace_exp    |
                +-------------------+
```

### Microservices Summary
| Service | Technology Stack | Port | Primary Responsibility | Database / Collection |
| :--- | :--- | :--- | :--- | :--- |
| **API Gateway** | FastAPI, Uvicorn, HTTPX | `8000` | Single entry point, CORS, reverse proxy, request routing | Stateless |
| **Auth Service** | Django 5, DRF, PyJWT, PyMongo | `8001` | User registration, login, JWT token minting, user profile & password security | MongoDB (`splitspace_auth.users`) |
| **Group Service** | FastAPI, Motor (Async PyMongo), Pydantic | `8002` | Group spaces, invite codes, shared expense splits, greedy debt minimizer | MongoDB (`splitspace_groups.groups`, `expenses`) |
| **Expense Service**| FastAPI, Motor, Pydantic | `8003` | Personal expense CRUD, multi-criteria filtering, categorical & monthly analytics | MongoDB (`splitspace_personal_expenses.personal_expenses`) |

---

## 2. Directory Tree of the Backend

```
backend/
├── api-gateway/
│   ├── .env.example
│   ├── main.py                     # API Gateway application & reverse proxy router
│   └── requirements.txt            # FastAPI, httpx, uvicorn, python-dotenv
├── auth-service/
│   ├── authentication/
│   │   ├── admin.py                # Django admin registration
│   │   ├── apps.py                 # Django application configuration (AuthenticationConfig)
│   │   ├── auth_backend.py         # Custom JWTAuthentication & AuthenticatedUser class
│   │   ├── models.py               # Document model & data access methods for User in MongoDB
│   │   ├── tests.py                # Unit test placeholders
│   │   ├── urls.py                 # Route definitions for authentication endpoints
│   │   ├── utils.py                # Token creation and verification helpers (PyJWT)
│   │   └── views.py                # APIViews for Register, Login, Token Refresh, Profile, Password
│   ├── config/
│   │   ├── asgi.py                 # ASGI entry point
│   │   ├── settings.py             # Django project settings & DRF configuration
│   │   ├── urls.py                 # Root URL configuration routing to authentication.urls
│   │   ├── wsgi.py                 # WSGI entry point for WSGI servers
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── db.py               # PyMongo MongoDB client & get_db helper
│   ├── manage.py                   # Django CLI administrative entry point
│   └── requirements.txt            # Django, djangorestframework, pymongo, pyjwt, python-dotenv
├── group-service/
│   ├── .env.example
│   ├── database.py                 # Motor async MongoDB client & get_db helper
│   ├── dependencies.py             # JWT bearer verification dependency (get_current_user)
│   ├── main.py                     # FastAPI application startup & router mounting
│   ├── models.py                   # Pydantic schemas (Group, Member, Split, Expense)
│   ├── requirements.txt            # FastAPI, motor, pyjwt, uvicorn, pydantic
│   └── routers/
│       ├── __init__.py
│       ├── expense.py              # Shared group expense creation & retrieval routes
│       └── group.py                # Space creation, joining via 6-char code, balance & debt engine
├── expense-service/
│   ├── .env.example
│   ├── database.py                 # Motor async MongoDB client & get_db helper
│   ├── dependencies.py             # JWT bearer verification dependency (get_current_user)
│   ├── main.py                     # FastAPI application startup & router mounting
│   ├── models.py                   # Pydantic schemas for personal expenses, categories & analytics
│   ├── requirements.txt            # FastAPI, motor, pyjwt, uvicorn, pydantic
│   └── routers/
│       ├── __init__.py
│       └── personal_expense.py     # Personal expense CRUD & analytic breakdown endpoints
├── init_db.py                      # Database initialization and index setup script
├── seed_demo.py                    # Comprehensive demo data seeder
├── test_groups.py                  # Integration tests for group service
└── test_personal_expenses.py       # Integration tests for personal expenses & analytics
```

---

## 3. Deep-Dive: Authentication Service (Django & DRF)

The Authentication Service is built on **Django 5.1** and **Django REST Framework (DRF)**. Unlike traditional Django setups that rely on SQL relational databases with ORM migrations, this service leverages **MongoDB** via `pymongo` for high throughput and flexible schema persistence, while utilizing Django's cryptographic password hashers (`PBKDF2PasswordHasher`) and DRF's authentication and view abstraction.

### 3.1 `backend/auth-service/config/utils/db.py`
This module manages the connection to MongoDB for the Django service.
- **`MONGO_URI`**: Reads environment variable `MONGO_URI` (defaults to `mongodb://localhost:27017`).
- **`MONGO_DB_NAME`**: Reads environment variable `MONGO_DB_NAME` (defaults to `splitspace_auth`).
- **`client = MongoClient(MONGO_URI)`**: Instantiates the thread-safe PyMongo connection pool.
- **`db = client[MONGO_DB_NAME]`**: Selects the target database instance.
- **`get_db()`**: Returns the active `db` object to callers across models and utilities.

### 3.2 `backend/auth-service/config/settings.py`
Configures the Django runtime environment:
- **Installed Apps**: Registers `rest_framework`, `corsheaders`, and the internal `authentication.apps.AuthenticationConfig`.
- **Middleware Pipeline**: Configures security, CORS, and common request processing.
- **Database Configuration**: Uses SQLite (`db.sqlite3`) strictly as a dummy backend for Django's internal system checks while user storage executes via MongoDB in `db.py`.
- **`REST_FRAMEWORK` Dictionary**: Disables default session and basic authentications; enforces stateless request handling.
- **Password Validation & Hashers**: Django's native PBKDF2 with SHA256 algorithm handles salted password hashing.

### 3.3 `backend/auth-service/authentication/models.py`
Defines the `User` domain model interface encapsulating all database interactions with the MongoDB `users` collection.

#### Methods in `User`:
- **`get_collection()`**:
  - *Returns*: `pymongo.collection.Collection` pointing to `splitspace_auth.users`.
- **`create(name, email, password)`**:
  - *Action*: Validates that `email` does not already exist in the collection (`find_one({"email": email})`). If it exists, raises a `ValueError("Email is already in use")`.
  - *Password Security*: Calls Django's `make_password(password)` to generate a salted PBKDF2 hash.
  - *UUID Generation*: Generates a canonical `uuid.uuid4()` string for the `id` field.
  - *Timestamps*: Assigns UTC `created_at` and `updated_at`.
  - *Insertion*: Calls `collection.insert_one(user_doc)`.
  - *Sanitization*: Drops the internal MongoDB BSON `_id` before returning the dictionary.
- **`get_by_email(email)`**:
  - *Action*: Executes `collection.find_one({"email": email})`.
  - *Sanitization*: Drops `_id` and returns the document or `None`.
- **`get_by_id(user_id)`**:
  - *Action*: Executes `collection.find_one({"id": user_id})`.
  - *Sanitization*: Drops `_id` and returns the document or `None`.
- **`update(user_id, update_data)`**:
  - *Action*: Automatically updates `updated_at` to the current UTC timestamp. If the dictionary includes a new `"password"`, hashes it using `make_password()`.
  - *Execution*: Invokes `collection.update_one({"id": user_id}, {"$set": update_data})`.
  - *Returns*: Fresh document via `cls.get_by_id(user_id)`.
- **`check_password(user_doc, raw_password)`**:
  - *Action*: Invokes Django's `check_password(raw_password, user_doc.get("password"))`. Returns `True` if valid, otherwise `False`.

### 3.4 `backend/auth-service/authentication/utils.py`
Provides cryptographic JSON Web Token (JWT) services using `pyjwt`.

#### Functions:
- **`generate_tokens(user_id)`**:
  - *Action*: Generates a dual-token pair (Access Token & Refresh Token) signed with HMAC-SHA256 (`HS256`) using `JWT_SECRET`.
  - *Access Token*: Payload `{"user_id": user_id, "exp": now + 60 mins, "type": "access"}`.
  - *Refresh Token*: Payload `{"user_id": user_id, "exp": now + 7 days, "type": "refresh"}`.
  - *Returns*: `{"access": "<jwt_string>", "refresh": "<jwt_string>"}`.
- **`decode_token(token, token_type=None)`**:
  - *Action*: Decodes and verifies the token signature against `JWT_SECRET`.
  - *Validation*: Verifies `exp` expiry; checks `payload.get("type") == token_type` if `token_type` is specified.
  - *Error Handling*: Catches `jwt.ExpiredSignatureError` and `jwt.InvalidTokenError`, returning `None` safely.

### 3.5 `backend/auth-service/authentication/auth_backend.py`
Bridges custom MongoDB storage with Django REST Framework's authentication lifecycle.

#### Classes:
- **`AuthenticatedUser(dict)`**:
  - Subclasses Python's `dict` to encapsulate the user's MongoDB profile fields.
  - Implements property `is_authenticated` returning `True`. This fulfills DRF's `request.user.is_authenticated` requirement.
- **`JWTAuthentication(BaseAuthentication)`**:
  - **`authenticate(self, request)`**:
    - Reads the `Authorization` header.
    - Ensures header begins with `Bearer `.
    - Extracts token and decodes via `decode_token(token, token_type='access')`.
    - Retrieves user document via `User.get_by_id(payload['user_id'])`.
    - If user does not exist or token is expired/invalid, raises DRF's `AuthenticationFailed`.
    - Strips `password` from the dictionary and returns tuple `(AuthenticatedUser(user_data), token)`.
  - **`authenticate_header(self, request)`**:
    - Returns string `'Bearer'` for `401 Unauthorized` challenge headers.

### 3.6 `backend/auth-service/authentication/views.py`
Houses all REST controllers inheriting from DRF's `APIView`. Standard response formatting is enforced via two helper functions:
- `success_response(message, data=None, status_code=200)`: Formats standard `{ "success": True, "message": "...", "data": ... }`.
- `error_response(message, errors=None, status_code=400)`: Formats standard `{ "success": False, "message": "...", "errors": ... }`.

#### Detailed View Methods:
1. **`RegisterView(APIView)` (`POST /api/auth/register`)**:
   - Accepts `name`, `email`, `password`, `confirmPassword`.
   - Validates presence of all fields.
   - Validates password match (`password == confirm`).
   - Validates email regex (`r"[^@]+@[^@]+\.[^@]+"`).
   - Enforces password length of at least 6 characters.
   - Calls `User.create()`. Returns `201 Created` with sanitized user object or `409 Conflict` if email is already in use.
2. **`LoginView(APIView)` (`POST /api/auth/login`)**:
   - Accepts `email`, `password`.
   - Locates user via `User.get_by_email(email)`.
   - Verifies credentials via `User.check_password(user_data, password)`.
   - Mints new tokens via `generate_tokens(user_data['id'])`.
   - Returns sanitized user metadata and access/refresh token pair.
3. **`RefreshTokenView(APIView)` (`POST /api/auth/refresh`)**:
   - Accepts `refresh` token string.
   - Decodes with `decode_token(refresh_token, token_type='refresh')`.
   - Verifies user existence in database.
   - Returns a fresh token pair.
4. **`MeView(APIView)` (`GET /api/auth/me`)**:
   - Protected by `authentication_classes = [JWTAuthentication]`, `permission_classes = [IsAuthenticated]`.
   - Returns the authenticated user's profile (`request.user`).
5. **`UpdateProfileView(APIView)` (`PUT /api/auth/profile`)**:
   - Protected by JWT authentication.
   - Accepts `name` in request body.
   - Invokes `User.update(request.user['id'], {"name": name})`.
   - Returns updated user profile.
6. **`ChangePasswordView(APIView)` (`POST /api/auth/change-password`)**:
   - Protected by JWT authentication.
   - Accepts `currentPassword` and `newPassword`.
   - Fetches full user document and verifies `currentPassword`.
   - Validates `newPassword` length (>= 6 characters).
   - Invokes `User.update()` with hashed new password.
   - Returns confirmation message.
7. **`LogoutView(APIView)` (`POST /api/auth/logout`)**:
   - Protected by JWT authentication.
   - Confirms user logout (ready for token blacklisting).

### 3.7 `backend/auth-service/authentication/urls.py`
Defines route mappings:
```python
urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('refresh', RefreshTokenView.as_view(), name='refresh'),
    path('me', MeView.as_view(), name='me'),
    path('profile', UpdateProfileView.as_view(), name='update_profile'),
    path('change-password', ChangePasswordView.as_view(), name='change_password'),
    path('logout', LogoutView.as_view(), name='logout'),
]
```

---

## 4. Deep-Dive: API Gateway (FastAPI & HTTPX)

The API Gateway runs as an asynchronous reverse proxy on port `8000`. It shields internal service architecture from external clients and unifies all microservice endpoints under a single origin.

### 4.1 Key Implementation Details in `backend/api-gateway/main.py`
- **CORS Configuration**:
  - Uses `CORSMiddleware` configured to permit origins `http://localhost:5173` and `http://127.0.0.1:5173` with credentials, all methods (`*`), and all headers (`*`).
- **Global Asynchronous Client**:
  - Instantiates `client = httpx.AsyncClient()`.
  - Hooks into `@app.on_event("shutdown")` to gracefully close connection pools via `await client.aclose()`.
- **`forward_request(request: Request, service_url: str, path: str)`**:
  - Core proxy handler.
  - Computes destination target: `f"{service_url}/{path}"`.
  - Extracts and filters incoming request headers: deliberately removes hop-by-hop headers (`host`, `content-length`) so the downstream service binds to its own host.
  - Streams incoming body asynchronously via `await request.body()`.
  - Forwards query parameters (`request.query_params`).
  - Receives response from downstream service, cleans outbound response headers (`content-length`, `content-encoding`, `transfer-encoding`, `connection`), and streams back to client with matching status code.
  - Catches `httpx.RequestError` and translates downstream downtime into `HTTP 503 Service Unavailable`.
- **Reverse Proxy Route Mappings**:
  - `/api/auth/{path:path}` -> Dispatches to `AUTH_SERVICE_URL` (`http://localhost:8001`)
  - `/api/groups/{path:path}` -> Dispatches to `GROUP_SERVICE_URL` (`http://localhost:8002`)
  - `/api/expenses/{path:path}` -> Dispatches to `GROUP_SERVICE_URL` (`http://localhost:8002`)
  - `/api/personal-expenses/{path:path}` -> Dispatches to `EXPENSE_SERVICE_URL` (`http://localhost:8003`)
  - `/health` -> Returns `{"status": "ok", "service": "api-gateway"}`.

---

## 5. Deep-Dive: Group Service (FastAPI & Motor)

The Group Service manages group creation, unique 6-character alphanumeric invite codes, membership rosters, shared group expense tracking, and an **algorithmically optimized greedy balance settlement engine**.

### 5.1 `backend/group-service/models.py`
Defines data structures using Pydantic:
- **`GroupCreate`**: `name: str`, `description: Optional[str]`.
- **`GroupMember`**: `user_id: str`, `role: str = "member"`, `joined_at: datetime`.
- **`GroupResponse`**: `id`, `code`, `name`, `description`, `created_by`, `members`, `created_at`, `updated_at`.
- **`JoinGroupRequest`**: `code: str`.
- **`Split`**: `user_id: str`, `amount: float`, `paid: bool = False`.
- **`ExpenseCreate`**: `group_id: str`, `description: str`, `total_amount: float`, `paid_by: str`, `splits: List[Split]`, `is_settlement: bool = False`.
- **`ExpenseResponse`**: Inherits `ExpenseCreate` plus `id: str`, `created_at: datetime`.

### 5.2 `backend/group-service/dependencies.py`
- **`get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security))`**:
  - Extracts bearer token from `Authorization` header.
  - Decodes and validates signature with `JWT_SECRET`.
  - Ensures token type is `"access"`.
  - Returns `user_id: str`. If invalid or expired, raises `HTTP 401 Unauthorized`.

### 5.3 `backend/group-service/routers/group.py`
Manages group spaces and executes debt minimization.

#### Functions and Endpoints:
- **`generate_group_code(length=6)`**:
  - Uses `random.choices(string.ascii_uppercase + string.digits, k=6)` to generate invite tokens.
- **`create_group(group: GroupCreate, user_id = Depends(get_current_user))` (`POST /api/groups/`)**:
  - Generates a unique 6-character code, querying MongoDB in a loop to guarantee zero collisions.
  - Creates the group document, automatically assigning the caller as `admin`.
  - Inserts document into `splitspace_groups.groups`.
- **`get_user_groups(user_id)` (`GET /api/groups/`)**:
  - Queries `{"members.user_id": user_id}`.
  - Returns all groups where the authenticated user is a participant.
- **`get_group_details(group_id, user_id)` (`GET /api/groups/{group_id}`)**:
  - Verifies group existence and membership. Returns full group metadata.
- **`join_group(req: JoinGroupRequest, user_id)` (`POST /api/groups/join`)**:
  - Looks up group by `code`.
  - Validates that caller is not already a member.
  - Pushes new `GroupMember` object into `members` array via MongoDB `$push`.
- **`get_group_balances(group_id, user_id)` (`GET /api/groups/{group_id}/balances`)**:
  - Calculates net financial positions and simplified debts.
  - **The Settlement Engine**:
    1. Initializes `balances = {member_id: 0.0}` for every member.
    2. Iterates over all expenses in the group:
       - Adds `total_amount` to payer's balance: `balances[payer] += total_amount`.
       - Subtracts split share from each participant: `balances[split_user] -= split_amount`.
    3. Categorizes participants into **`debtors`** (negative balance: owes money) and **`creditors`** (positive balance: gets money back).
    4. Sorts both lists in descending order of absolute debt/credit.
    5. Runs a two-pointer **Greedy Settlement Minimization Algorithm**:
       ```python
       while i < len(debtors) and j < len(creditors):
           settle_amount = min(debtors[i]["amount"], creditors[j]["amount"])
           debts.append({
               "from_user": debtors[i]["user_id"],
               "to_user": creditors[j]["user_id"],
               "amount": round(settle_amount, 2)
           })
           debtors[i]["amount"] -= settle_amount
           creditors[j]["amount"] -= settle_amount
           if debtors[i]["amount"] < 0.01: i += 1
           if creditors[j]["amount"] < 0.01: j += 1
       ```
    6. Returns net balances and the mathematically minimized list of debt transfers (`debts`).

### 5.4 `backend/group-service/routers/expense.py`
- **`add_expense(expense: ExpenseCreate, user_id)` (`POST /api/expenses/`)**:
  - Confirms group existence and verifies that caller belongs to the group.
  - Validates split sum: verifies `abs(sum(splits) - total_amount) <= 0.01`.
  - Supports settlement expenses (`is_settlement: true`).
  - Inserts document into `splitspace_groups.expenses`.
- **`get_group_expenses(group_id, user_id)` (`GET /api/expenses/group/{group_id}`)**:
  - Verifies membership.
  - Returns historical list of group transactions sorted by creation date.

---

## 6. Deep-Dive: Expense Service (FastAPI & Motor)

The Expense Service operates on port `8003` and provides high-speed personal financial ledger capabilities, multi-criteria filtering, and analytical intelligence.

### 6.1 `backend/expense-service/models.py`
- **`PersonalExpenseCreate`**: `title`, `amount`, `category`, `date`, `payment_method`, `notes`.
- **`PersonalExpenseUpdate`**: Optional fields for partial updates.
- **`PersonalExpenseResponse`**: Complete expense record with `id`, `user_id`, timestamps.
- **`CategoryBreakdown`**: `category`, `total_amount`, `percentage`, `count`.
- **`MonthlyTrend`**: `month`, `month_label`, `total_amount`, `count`.
- **`AnalyticsSummary`**: `total_spent`, `this_month_spent`, `last_month_spent`, `change_pct`, `expense_count`, `category_breakdown`, `monthly_trends`.

### 6.2 `backend/expense-service/routers/personal_expense.py`

#### Methods & Endpoints:
1. **`create_expense(expense, user_id)` (`POST /api/personal-expenses/`)**:
   - Validates and stores individual expense records tied to the authenticated `user_id`.
2. **`list_expenses(category, search, start_date, end_date, user_id)` (`GET /api/personal-expenses/`)**:
   - Supports composable MongoDB queries:
     - Exact match on `category` (when not `"All"`).
     - Case-insensitive regex substring match on `title` (`{"$regex": search, "$options": "i"}`).
     - Date ranges with ISO format conversion (`$gte`, `$lte`).
   - Results sorted by date descending (`.sort("date", -1)`).
3. **`get_analytics_summary(user_id)` (`GET /api/personal-expenses/analytics/summary`)**:
   - Calculates high-level KPI metrics:
     - Cumulative lifetime spending (`total_spent`).
     - Current month spending vs. previous month spending.
     - Month-over-month velocity delta: `((this_month - last_month) / last_month) * 100`.
     - Categorical spending allocation percentages.
     - 6-month historical monthly expenditure trends.
4. **`get_expense(expense_id, user_id)` (`GET /api/personal-expenses/{expense_id}`)**:
   - Retrieves single expense record by UUID; verifies ownership.
5. **`update_expense(expense_id, expense_update, user_id)` (`PUT /api/personal-expenses/{expense_id}`)**:
   - Partial update via `$set` with updated UTC timestamp.
6. **`delete_expense(expense_id, user_id)` (`DELETE /api/personal-expenses/{expense_id}`)**:
   - Deletes expense record; guarantees user cannot delete another user's record.

---

## 7. Database Architecture & MongoDB Schemas

SplitSpace uses MongoDB collections across microservices:

### 7.1 Collection: `splitspace_auth.users`
```json
{
  "id": "c1f7b029-9e8d-4f1a-b3c2-d9e0f1a2b3c4",
  "name": "Alex Morgan",
  "email": "alex@splitspace.io",
  "password": "pbkdf2_sha256$870000$salt...$hash...",
  "created_at": "2026-11-18T10:00:00Z",
  "updated_at": "2026-11-18T10:00:00Z"
}
```
- **Indexes**: `email` (Unique).

### 7.2 Collection: `splitspace_groups.groups`
```json
{
  "id": "e4b2a8d1-5f3c-4e9b-8a7d-1c2e3f4a5b6c",
  "code": "X8K9Q2",
  "name": "Flat 402 - Household",
  "description": "Shared apartment utilities & groceries",
  "created_by": "c1f7b029-9e8d-4f1a-b3c2-d9e0f1a2b3c4",
  "members": [
    {
      "user_id": "c1f7b029-9e8d-4f1a-b3c2-d9e0f1a2b3c4",
      "role": "admin",
      "joined_at": "2026-11-18T10:00:00Z"
    }
  ],
  "created_at": "2026-11-18T10:00:00Z",
  "updated_at": "2026-11-18T10:00:00Z"
}
```
- **Indexes**: `id` (Unique), `code` (Unique), `members.user_id`.

### 7.3 Collection: `splitspace_groups.expenses`
```json
{
  "id": "f8a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c",
  "group_id": "e4b2a8d1-5f3c-4e9b-8a7d-1c2e3f4a5b6c",
  "description": "High-speed Fiber Internet",
  "total_amount": 1499.00,
  "paid_by": "c1f7b029-9e8d-4f1a-b3c2-d9e0f1a2b3c4",
  "splits": [
    { "user_id": "c1f7b029-9e8d-4f1a-b3c2-d9e0f1a2b3c4", "amount": 749.50, "paid": true },
    { "user_id": "d2e3f4a5-b6c7-4d8e-9f0a-1b2c3d4e5f6a", "amount": 749.50, "paid": false }
  ],
  "is_settlement": false,
  "created_at": "2026-11-18T11:00:00Z"
}
```
- **Indexes**: `group_id`, `paid_by`.

### 7.4 Collection: `splitspace_personal_expenses.personal_expenses`
```json
{
  "id": "a9b8c7d6-e5f4-4a3b-2c1d-0e9f8a7b6c5d",
  "user_id": "c1f7b029-9e8d-4f1a-b3c2-d9e0f1a2b3c4",
  "title": "Fresh Produce & Groceries",
  "amount": 845.50,
  "category": "Groceries",
  "date": "2026-11-18T12:30:00Z",
  "payment_method": "UPI",
  "notes": "Weekly organic supplies",
  "created_at": "2026-11-18T12:35:00Z",
  "updated_at": "2026-11-18T12:35:00Z"
}
```
- **Indexes**: `user_id`, `date`, `category`.

---

## 8. Complete End-to-End System Workflows

### 8.1 Workflow 1: User Registration & Authentication
1. **Client Request**: Frontend POSTs name, email, password to `http://localhost:8000/api/auth/register`.
2. **Gateway**: Passes request to `AUTH_SERVICE_URL/api/auth/register` (`8001`).
3. **Django Validation**: `RegisterView` executes regex email check, password confirmation check, and verifies uniqueness in MongoDB.
4. **Password Hashing**: Django hashes password via PBKDF2 with SHA-256 and unique salt.
5. **Database Write**: `User.create()` writes record to `splitspace_auth.users`.
6. **Token Generation**: On subsequent login, `LoginView` verifies hash and invokes `generate_tokens()`, returning access token (60 min) and refresh token (7 days).

### 8.2 Workflow 2: Group Creation & Code-Based Joining
1. **Creation**: User initiates space creation -> Gateway -> `Group Service` (`POST /api/groups/`).
2. **Collision-Free Code**: `generate_group_code()` creates a 6-character uppercase alphanumeric code and verifies uniqueness against MongoDB.
3. **Group Record**: Group document is inserted with caller marked as `admin`.
4. **Member Join**: Another user submits the 6-character code (`POST /api/groups/join`).
5. **Membership Update**: Group Service finds the group by `code`, verifies applicant is not already present, and executes an atomic `$push` operation to add the user to the `members` array.

### 8.3 Workflow 3: Shared Expense Splitting & Debt Minimization
1. **Expense Logging**: A group member logs an expense with equal or custom split allocations (`POST /api/expenses/`).
2. **Split Verification**: Group service validates that the sum of splits equals `total_amount`.
3. **Balance Calculation**: When viewing `/balances`, the service sums all payments and split obligations per member.
4. **Greedy Settlement Calculation**:
   - Calculates net balances: Net = (Total Paid) - (Total Owed).
   - Separates members into creditors (positive net) and debtors (negative net).
   - Matches the highest debtor with the highest creditor, discharging the maximum possible obligation per step.
   - Generates minimal transaction list (e.g., reduces 10 cross-member debts to 2 direct transfers).
5. **Settlement Transfer**: When a debt is paid, a special expense marked `is_settlement: true` is logged, instantly zeroing out the balance.

---

## 9. Setup, Configuration & Service Orchestration

### 9.1 Environment Variables
Each service directory includes a `.env.example`. Standard configuration:
```env
# Shared JWT Secret (Must be identical across all services)
JWT_SECRET=splitspace_jwt_secure_vault_key_2026

# Database Connection
MONGO_URI=mongodb://localhost:27017

# Gateway Routing Targets
AUTH_SERVICE_URL=http://localhost:8001
GROUP_SERVICE_URL=http://localhost:8002
EXPENSE_SERVICE_URL=http://localhost:8003
```

### 9.2 Launching the Backend Services
To run the full backend environment locally, launch each service in its own terminal or background process:

```bash
# 1. API Gateway (Port 8000)
cd backend/api-gateway
source ../expense-service/venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 2. Auth Service (Django - Port 8001)
cd backend/auth-service
source venv/bin/activate
python manage.py runserver 0.0.0.0:8001

# 3. Group Service (FastAPI - Port 8002)
cd backend/group-service
source ../expense-service/venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8002 --reload

# 4. Expense Service (FastAPI - Port 8003)
cd backend/expense-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8003 --reload
```

### 9.3 Database Initialization & Demo Seeding
To initialize database indexes and seed comprehensive demo accounts:
```bash
# Setup indexes
python backend/init_db.py

# Seed demo data (demo@splitspace.io / demo123)
python backend/seed_demo.py
```
