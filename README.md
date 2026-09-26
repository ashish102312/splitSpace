# SplitSpace

SplitSpace is a web application for personal and group expense management. It allows users to track their own spending and share costs with friends, family, or roommates without the headache.

## Current Architecture

The project is currently built with a microservices-based distributed system architecture:
1. **Frontend**: React application built with Vite and Tailwind CSS.
2. **API Gateway**: A central reverse proxy built with FastAPI that routes incoming frontend requests to the appropriate backend microservices.
3. **Microservices**: Currently, only the `auth-service` (built with Django) is implemented.

Other services will be added in later phases, including:
- Expense Service
- Group Service
- Analytics Service
- Notification Service
- Insight Service

**Important**: These future services are NOT implemented yet. Only the foundational authentication system and API gateway are active.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **API Gateway**: Python, FastAPI, Uvicorn, HTTPX
- **Backend Services**: Python, Django, Django REST Framework
- **Database**: MongoDB (via PyMongo)
- **Authentication**: Custom JWT implementation (Access & Refresh tokens)

## Folder Structure

```
splitSpace/
├── frontend/             # React application
├── backend/              # Backend services
│   ├── api-gateway/      # FastAPI based central API Gateway
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── auth-service/     # Independent Django project for Authentication
│   │   ├── config/       # Django core settings
│   │   ├── authentication/ # Auth app (Views, Models via MongoDB, Utils)
│   │   ├── venv/         # Python virtual environment
│   │   ├── manage.py
│   │   └── requirements.txt
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
