# SplitSpace

SplitSpace is a modern web application for personal and group expense management. It allows users to track their personal spending, organize group activities, split costs seamlessly with friends, family, or roommates, and calculate optimal debt settlements without the headache.

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
                      └─────┬──────────────┬────┘
                            │              │
         /api/auth/*        │              │  /api/groups/* & /api/expenses/*
         Proxy Traffic      │              │  Proxy Traffic
                            ▼              ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │   Auth Microservice    │      │   Group Microservice   │
       │     Django / DRF       │      │     FastAPI (Async)    │
       │ http://localhost:8001  │      │ http://localhost:8002  │
       └───────────┬────────────┘      └───────────┬────────────┘
                   │                               │
                   ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │     MongoDB Database   │      │     MongoDB Database   │
       │    (splitspace_auth)   │      │   (splitspace_groups)  │
       └────────────────────────┘      └────────────────────────┘
```

### Active Components:
1. **Frontend**: React application built with Vite and Tailwind CSS providing reactive dashboards, group overviews, detailed expense tracking, and debt settlement interfaces.
2. **API Gateway**: Central reverse proxy built with FastAPI and HTTPX. Handles client request routing, CORS headers, and service multiplexing on port `8000`.
3. **Auth Service**: Django REST Framework service on port `8001` managing user registration, authentication, JWT tokens (access + refresh), and user profile state.
4. **Group Service**: Async FastAPI microservice on port `8002` managing group lifecycles (creation, 6-character unique invite codes, joining), group expenses, member splits, and real-time net balance & debt settlement calculations.

### Future Planned Microservices:
- **Analytics Service**: Spending trends, category breakdown, and monthly budget forecasts.
- **Notification Service**: Activity alerts, settlement reminders, and invites.
- **Insight Service**: AI-assisted spending recommendations and anomalies.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router |
| **API Gateway** | Python 3.10+, FastAPI, Uvicorn, HTTPX |
| **Auth Microservice** | Python, Django 4.x, Django REST Framework, PyMongo, PyJWT |
| **Group Microservice** | Python, FastAPI, Motor (Async MongoDB), Pydantic v2, PyJWT |
| **Database** | MongoDB (dedicated collections / databases per service) |
| **Security & Auth** | Shared secret JWT verification (HS256 Bearer tokens) |

---

## 📂 Project Structure

```
splitSpace/
├── frontend/                     # React Single Page Application (Vite + Tailwind)
│   ├── src/
│   │   ├── api/                  # API client modules (auth, groups, expenses)
│   │   ├── components/           # Navbar, Layouts, UI widgets
│   │   ├── context/              # AuthContext & global state providers
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Groups, GroupDetails, Profile
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                      # Backend microservices & utilities
│   ├── api-gateway/              # Central FastAPI reverse proxy (port 8000)
│   │   ├── main.py               # Route proxies for /api/auth, /api/groups, /api/expenses
│   │   └── requirements.txt
│   ├── auth-service/             # Django authentication microservice (port 8001)
│   │   ├── authentication/       # Auth views, models, and MongoDB helpers
│   │   ├── config/               # Django project settings & root URLs
│   │   ├── manage.py
│   │   └── requirements.txt
│   ├── group-service/            # FastAPI group & expense microservice (port 8002)
│   │   ├── routers/
│   │   │   ├── group.py          # Group CRUD, invite codes, balances & settlements
│   │   │   └── expense.py        # Group expense creation & expense history
│   │   ├── database.py           # Motor async MongoDB connector
│   │   ├── dependencies.py       # JWT authentication & user extraction
│   │   ├── models.py             # Pydantic schemas (Groups, Expenses, Splits)
│   │   ├── main.py               # FastAPI entrypoint
│   │   └── requirements.txt
│   ├── init_db.py                # Database & collection initialization script
│   └── test_groups.py            # Integration test script for groups & settlements
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

Create `.env` configuration files for the services:

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

#### **API Gateway (`backend/api-gateway/.env`):** *(Optional, defaults configured)*
```env
AUTH_SERVICE_URL=http://localhost:8001
GROUP_SERVICE_URL=http://localhost:8002
```

#### **Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

### 3. Initialize MongoDB Collections & Indexes (Recommended)

Before running the microservices, you can initialize the collections and unique indexes for `splitspace_auth` and `splitspace_groups`:

```bash
cd backend/auth-service
source venv/bin/activate
python ../init_db.py
```

This ensures:
- `splitspace_auth.users`: Unique indexes on `email` and `id`
- `splitspace_groups.groups`: Unique indexes on `code` and `id`, and index on `members.user_id`
- `splitspace_groups.expenses`: Unique index on `id`, and index on `group_id`

---

### 4. Run Backend Services

Open separate terminal tabs for each service:

#### **Tab 1: Auth Service (Port 8001)**
```bash
cd backend/auth-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 8001
```

#### **Tab 2: Group Service (Port 8002)**
```bash
cd backend/group-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

#### **Tab 3: API Gateway (Port 8000)**
```bash
cd backend/api-gateway
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

### 5. Run Frontend (Port 5173)

#### **Tab 4: Frontend**
```bash
cd frontend
npm install
npm run dev
```

Visit the app at **http://localhost:5173**.

---

### 6. (Optional) Run Integration Verification Script

You can verify end-to-end functionality across Auth, Gateway, and Group Service using the built-in test script:

```bash
python backend/test_groups.py
```

This test:
1. Registers three test users (Alice, Bob, Charlie).
2. Authenticates and retrieves JWT tokens.
3. Creates a group and retrieves a unique 6-character code.
4. Adds Bob and Charlie to the group via the invite code.
5. Records a $90 expense paid by Alice and split equally ($30 each).
6. Computes net balances and debt settlement recommendations.
7. Submits a settlement payment from Bob to Alice and recalculates balances.

---

## 📡 API Endpoints Reference

All requests from the frontend route through the API Gateway at `http://localhost:8000/api`.

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

### 👥 Group Service (`/api/groups/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/groups/` | Create a new group (auto-generates invite code) | Bearer Token |
| `GET` | `/api/groups/` | List all groups the current user is a member of | Bearer Token |
| `GET` | `/api/groups/{group_id}` | Get details and member roster of a group | Bearer Token |
| `POST` | `/api/groups/join` | Join an existing group using a 6-character code | Bearer Token |
| `GET` | `/api/groups/{group_id}/balances` | Calculate net balances and optimal settlement transactions | Bearer Token |

### 💸 Expense Management (`/api/expenses/*`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/expenses/` | Add a new group expense or record a settlement payment | Bearer Token |
| `GET` | `/api/expenses/group/{group_id}` | Retrieve all expense history for a group | Bearer Token |

---

## 💡 Key Features of the Group Service

- **Unique Invite Codes**: Automatically generates random 6-character alphanumeric codes for friction-free group sharing.
- **Role-Based Membership**: Group creators are assigned the `admin` role, and joining members receive the `member` role.
- **Custom Split Calculations**: Expenses can be divided across participants with flexible split amounts.
- **Smart Debt Simplification**: Computes net member balances and uses a greedy settlement algorithm to pair debtors with creditors, reducing the number of payments required to settle up.
- **Settlement Tracking**: Allows members to record direct repayments (`is_settlement: true`) to resolve their balances.

---

## 📜 License

This project is licensed under the MIT License.

