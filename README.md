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
│   └── test_groups.py            # Integration test script for groups & settlements
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Configure MongoDB

You must have MongoDB running locally or accessible via a URI. By default, the application connects to `mongodb://localhost:27017`.

### 2. Environment Variables

Create `.env` files in both frontend and backend directories.

**Backend Auth Service (`backend/auth-service/.env`):**
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=splitspace_auth
JWT_SECRET=supersecretjwtkey_replace_me_in_production
```

**Frontend (`frontend/.env`):**
*(Points to the API Gateway on port 8000)*
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Install & Start Backend (auth-service)

```bash
cd backend/auth-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start the server on port 8001
python manage.py runserver 8001
```

### 4. Install & Start API Gateway

Open a new terminal window:
```bash
cd backend/api-gateway
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start the gateway on port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Install & Start Frontend

Open a new terminal window:
```bash
cd frontend
npm install

# Start the development server (runs on port 5173 by default)
npm run dev
```

## Available Authentication APIs

The API Gateway routes all requests starting with `/api/auth/` to the `auth-service`, which provides the following REST API endpoints:

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and receive JWT tokens
- `POST /api/auth/token/refresh/` - Refresh an expired access token using a refresh token
- `GET /api/auth/me/` - Retrieve the currently authenticated user's profile
- `PUT /api/auth/profile/` - Update the user's name
- `POST /api/auth/change-password/` - Change the user's password
- `POST /api/auth/logout/` - Logout the user

