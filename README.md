# SplitSpace

SplitSpace is a web application for personal and group expense management. It allows users to track their own spending and share costs with friends, family, or roommates without the headache.

## Current Architecture

The project is currently built with a foundational architecture separating the frontend (React) and a single backend service (`auth-service`) built with Django.

This is Phase 1 of a larger microservices-based distributed system. Currently, only the `auth-service` has been implemented as an independently runnable Django project. Other services will be added in later phases, including:
- Expense Service
- Group Service
- Analytics Service
- Notification Service
- Insight Service

**Important**: These future services are NOT implemented yet. Only the foundational authentication system is active.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Python, Django, Django REST Framework
- **Database**: MongoDB (via PyMongo)
- **Authentication**: Custom JWT implementation (Access & Refresh tokens)

## Folder Structure

```
splitSpace/
├── frontend/             # React application
├── backend/              # Backend services
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

**Backend (`backend/auth-service/.env`):**
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=splitspace_auth
JWT_SECRET=supersecretjwtkey_replace_me_in_production
```

**Frontend (`frontend/.env`):**
```
VITE_API_BASE_URL=http://localhost:8001/api
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

### 4. Install & Start Frontend

```bash
cd frontend
npm install

# Start the development server (runs on port 5173 by default)
npm run dev
```

## Available Authentication APIs

The `auth-service` provides the following REST API endpoints:

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and receive JWT tokens
- `POST /api/auth/token/refresh/` - Refresh an expired access token using a refresh token
- `GET /api/auth/me/` - Retrieve the currently authenticated user's profile
- `PUT /api/auth/profile/` - Update the user's name
- `POST /api/auth/change-password/` - Change the user's password
- `POST /api/auth/logout/` - Logout the user
