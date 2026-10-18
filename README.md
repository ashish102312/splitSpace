# SplitSpace

SplitSpace is a modern web application for personal and group expense management. It allows users to track their personal spending, organize group activities, split costs seamlessly with friends, family, or roommates, analyze out-of-pocket spending trends, and calculate optimal debt settlements without the headache.

---

## 🏛️ System Architecture

SplitSpace is engineered with a **microservices-based distributed architecture**, ensuring independent scalability, separation of concerns, and clean service boundaries:

```
                      ┌─────────────────────────┐
                      │  Frontend (React/Vite)  │
                      │  http://localhost:5173  │
                      └────────────┬────────────┘
                                   │ HTTP / JSON
                                   ▼
                      ┌─────────────────────────┐
                      │   FastAPI API Gateway   │
                      │  http://localhost:8000  │
                      └─────┬───────┬───────┬───┘
                            │       │       │
       /api/auth/*          │       │       │  /api/personal-expenses/*
       Proxy Traffic        │       │       │  Proxy Traffic
                            ▼       │       ▼
       ┌────────────────────────┐   │   ┌────────────────────────┐
       │   Auth Microservice    │   │   │   Expense Microservice │
       │     Django / DRF       │   │   │     FastAPI (Async)    │
       │ http://localhost:8001  │   │   │ http://localhost:8003  │
       └───────────┬────────────┘   │   └───────────┬────────────┘
                   │                │               │
                   ▼                │               ▼
       ┌────────────────────────┐   │   ┌────────────────────────┐
       │     MongoDB Database   │   │   │     MongoDB Database   │
       │    (splitspace_auth)   │   │   │  (splitspace_expenses) │
       └────────────────────────┘   │   └────────────────────────┘
                                    │
                                    │  /api/groups/* & /api/expenses/*
                                    │  Proxy Traffic
                                    ▼
                       ┌────────────────────────┐
                       │   Group Microservice   │
                       │     FastAPI (Async)    │
                       │ http://localhost:8002  │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │     MongoDB Database   │
                       │   (splitspace_groups)  │
                       └────────────────────────┘
```

### Active Components:
1. **Frontend**: React application built with Vite and Tailwind CSS providing reactive dashboards, group overviews, personal expense logs, spending analytics, and debt settlement interfaces.
2. **API Gateway**: Central reverse proxy built with FastAPI and HTTPX. Handles client request routing, CORS headers, and service multiplexing on port `8000`.
3. **Auth Service**: Django REST Framework service on port `8001` managing user registration, authentication, JWT tokens (access + refresh), and user profile state.
4. **Group Service**: Async FastAPI microservice on port `8002` managing group lifecycles (creation, 6-character unique invite codes, joining), group expenses, member splits, and real-time net balance & debt settlement calculations.
5. **Expense Service**: Async FastAPI microservice on port `8003` managing personal out-of-pocket expenses (CRUD, search, filtering by category and payment method), historical monthly trends, and visual category breakdowns.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Axios, React Router v7 |
| **API Gateway** | Python 3.10+, FastAPI, Uvicorn, HTTPX |
| **Auth Microservice** | Python, Django 4.x, Django REST Framework, PyMongo, PyJWT |
| **Group Microservice** | Python, FastAPI, Motor (Async MongoDB), Pydantic v2, PyJWT |
| **Expense Microservice** | Python, FastAPI, Motor (Async MongoDB), Pydantic v2, PyJWT |
| **Database** | MongoDB (3 dedicated databases: `splitspace_auth`, `splitspace_groups`, `splitspace_expenses`) |
| **Security & Auth** | Shared secret JWT verification (HS256 Bearer tokens) across all services |

---

## 📂 Project Structure

```
splitSpace/
├── frontend/                     # React Single Page Application (Vite + Tailwind)
│   ├── src/
│   │   ├── api/                  # API client modules (auth, groups, expenses, personalExpenses)
│   │   ├── components/           # Sidebar, ProtectedRoute, UI widgets
│   │   ├── context/              # AuthContext & global state providers
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Groups, GroupDetails, Expenses, Analytics, Profile
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                      # Backend microservices & utilities
│   ├── api-gateway/              # Central FastAPI reverse proxy (port 8000)
│   │   ├── main.py               # Route proxies for /api/auth, /api/groups, /api/expenses, /api/personal-expenses
│   │   └── requirements.txt
│   ├── auth-service/             # Django authentication microservice (port 8001)
│   │   ├── authentication/       # Auth views, models, and MongoDB helpers
│   │   ├── config/               # Django project settings & root URLs
│   │   ├── manage.py
│   │   └── requirements.txt
│   ├── group-service/            # FastAPI group & split expense microservice (port 8002)
│   │   ├── routers/
│   │   │   ├── group.py          # Group CRUD, invite codes, balances & settlements
│   │   │   └── expense.py        # Group expense creation & expense history
│   │   ├── database.py           # Motor async MongoDB connector
│   │   ├── dependencies.py       # JWT authentication & user extraction
│   │   ├── models.py             # Pydantic schemas (Groups, Expenses, Splits)
│   │   ├── main.py               # FastAPI entrypoint
│   │   └── requirements.txt
│   ├── expense-service/          # FastAPI personal expense & analytics microservice (port 8003)
│   │   ├── routers/
│   │   │   └── personal_expense.py # CRUD, filtering, categories & analytics summaries
│   │   ├── database.py           # Motor async MongoDB connector
│   │   ├── dependencies.py       # JWT authentication & user extraction
│   │   ├── models.py             # Pydantic schemas (PersonalExpense, AnalyticsSummary)
│   │   ├── main.py               # FastAPI entrypoint
│   │   └── requirements.txt
│   ├── init_db.py                # Database & collection initialization script
│   ├── test_groups.py            # Integration test script for groups & settlements
│   └── test_personal_expenses.py # Integration test script for personal expenses & analytics
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- **MongoDB** running locally (`mongodb://localhost:27017`) or via MongoDB Atlas

---

### 2. Configure Environment Variables

Create `.env` configuration files for each service:

#### **Auth Service (`backend/auth-service/.env`):**
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=splitspace_auth
JWT_SECRET=supersecretjwtkey_replace_me_in_production
```

#### **Group Service (`backend/group-service/.env`):**
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=splitspace_groups
JWT_SECRET=supersecretjwtkey_replace_me_in_production
PORT=8002
```

#### **Expense Service (`backend/expense-service/.env`):**
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=splitspace_expenses
JWT_SECRET=supersecretjwtkey_replace_me_in_production
PORT=8003
```

#### **API Gateway (`backend/api-gateway/.env`):** *(Optional, defaults configured)*
```env
AUTH_SERVICE_URL=http://localhost:8001
GROUP_SERVICE_URL=http://localhost:8002
EXPENSE_SERVICE_URL=http://localhost:8003
```

#### **Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### 3. Initialize MongoDB Databases, Collections & Indexes

Initialize the 3 separate databases and high-performance unique/compound indexes:

```bash
python backend/init_db.py
```

This sets up:
- `splitspace_auth.users`: Unique indexes on `email` and `id`
- `splitspace_groups.groups`: Unique indexes on `code` and `id`, and index on `members.user_id`
- `splitspace_groups.expenses`: Unique index on `id`, and index on `group_id`
- `splitspace_expenses.personal_expenses`: Unique index on `id`, index on `user_id`, `date`, `category`, and compound index on `[("user_id", 1), ("date", -1)]`

---

### 4. Run Backend Microservices

Open separate terminal windows/tabs for each service:

#### **Tab 1: Auth Service (Port 8001)**
```bash
cd backend/auth-service
source venv/bin/activate
python manage.py runserver 8001
```

#### **Tab 2: Group Service (Port 8002)**
```bash
cd backend/group-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

#### **Tab 3: Expense Service (Port 8003)**
```bash
cd backend/expense-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8003 --reload
```

#### **Tab 4: API Gateway (Port 8000)**
```bash
cd backend/api-gateway
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

### 5. Run Frontend (Port 5173)

#### **Tab 5: Frontend**
```bash
cd frontend
npm install
npm run dev
```

Visit the application at **http://localhost:5173**.

---

### 6. Automated Integration Verification

You can verify full functionality across the microservices using the test suites:

#### **Group Service & Settlement Verification:**
```bash
python backend/test_groups.py
```

#### **Personal Expense & Financial Analytics Verification:**
```bash
python backend/test_personal_expenses.py
```

---

## 📡 API Endpoints Reference

All client requests route through the API Gateway at `http://localhost:8000/api`.

### 🔐 Authentication Service (`/api/auth/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user | No |
| `POST` | `/api/auth/login/` | User login (returns access & refresh tokens) | No |
| `POST` | `/api/auth/token/refresh/` | Refresh expired access token | No |
| `GET` | `/api/auth/me/` | Fetch current user's profile | Bearer Token |
| `PUT` | `/api/auth/profile/` | Update profile information | Bearer Token |
| `POST` | `/api/auth/change-password/` | Change password | Bearer Token |
| `POST` | `/api/auth/logout/` | Revoke tokens & logout | Bearer Token |

#### 🔒 Authentication Security & Flow
- **Token Pairing**: Generates short-lived access tokens and refresh tokens upon login/registration.
- **Challenge Responses**: Employs standard HTTP `Bearer` challenge headers returning clean `401 Unauthorized` responses on missing or expired tokens, triggering client-side automatic token renewal.
- **Endpoint Protection**: Protected routes (`/me/`, `/profile/`, `/change-password/`, `/logout/`) enforce Django REST Framework `IsAuthenticated` permission classes.

---

### 👥 Group Service (`/api/groups/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/groups/` | Create a new group (auto-generates 6-character code) | Bearer Token |
| `GET` | `/api/groups/` | List all groups the current user is a member of | Bearer Token |
| `GET` | `/api/groups/{group_id}` | Get details and member roster of a group | Bearer Token |
| `POST` | `/api/groups/join` | Join an existing group using a 6-character code | Bearer Token |
| `GET` | `/api/groups/{group_id}/balances` | Calculate net balances and optimal settlement transactions | Bearer Token |

---

### 💸 Group Split Expenses (`/api/expenses/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/expenses/` | Add a new group expense or record a settlement payment | Bearer Token |
| `GET` | `/api/expenses/group/{group_id}` | Retrieve all expense history for a group | Bearer Token |

---

### 💳 Personal Expenses & Analytics (`/api/personal-expenses/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/personal-expenses/` | Log a new personal expense with category & payment mode | Bearer Token |
| `GET` | `/api/personal-expenses/` | List personal expenses with search & filter params (`category`, `payment_method`, `search`) | Bearer Token |
| `GET` | `/api/personal-expenses/{id}` | Get individual personal expense details | Bearer Token |
| `PUT` | `/api/personal-expenses/{id}` | Update an existing personal expense | Bearer Token |
| `DELETE` | `/api/personal-expenses/{id}` | Remove a personal expense | Bearer Token |
| `GET` | `/api/personal-expenses/analytics/summary` | Generate spending metrics, monthly velocity & category distributions | Bearer Token |

---

## 💡 Key Features of SplitSpace

- **Personal Expense Tracking**: Dedicated log of personal expenses with instant categorization (Food & Dining, Groceries, Shopping, Travel, Utilities, etc.) and payment tagging (UPI, Credit Card, Debit Card, Cash).
- **Financial Analytics & Velocity**: Dynamic progress bars, percentage breakdowns by category, month-over-month trend comparison, and smart budgeting insights.
- **Dynamic Unified Dashboard**: Live overview of total personal outflow, monthly billing cycle run-rate, recent receipts, and quick links to active groups.
- **Unique Invite Codes**: Automatically generates random 6-character alphanumeric codes for friction-free group sharing.
- **Custom Split Calculations**: Expenses can be divided across group members with flexible split amounts.
- **Smart Debt Simplification**: Computes net member balances and uses a greedy settlement algorithm to pair debtors with creditors, minimizing transactions.
- **Settlement Tracking**: Allows members to record direct repayments (`is_settlement: true`) to resolve their balances.

---

## 📜 License

This project is licensed under the MIT License.
