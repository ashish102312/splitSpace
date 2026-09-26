#!/bin/bash
git add .gitignore
git commit -m "chore: update root gitignore"

git add frontend/index.html
git commit -m "fix(frontend): re-create missing index.html for Vite"

git add frontend/src/context/AuthContext.jsx
git commit -m "feat(frontend): implement AuthContext with JWT refresh logic"

git add frontend/src/pages/Landing.jsx
git commit -m "feat(frontend): build modern Landing page UI"

git add frontend/src/pages/Register.jsx frontend/src/pages/Login.jsx
git commit -m "feat(frontend): create unified Register and Login pages"

git add frontend/src/pages/Dashboard.jsx
git commit -m "feat(frontend): implement Dashboard with protected routes"

git add frontend/src/components/ProtectedRoute.jsx
git commit -m "feat(frontend): add ProtectedRoute for authenticated access"

git add frontend/src/api/
git commit -m "feat(frontend): setup axios client and api endpoints"

git add frontend/package.json frontend/package-lock.json
git commit -m "chore(frontend): update dependencies"

git add frontend/
git commit -m "feat(frontend): complete frontend base structure and styling"

git add backend/auth-service/manage.py backend/auth-service/config/
git commit -m "feat(backend): initialize auth-service django project"

git add backend/auth-service/authentication/models.py
git commit -m "feat(backend): setup MongoDB user schema without ORM"

git add backend/auth-service/authentication/auth_backend.py backend/auth-service/authentication/utils.py
git commit -m "feat(backend): implement JWT authentication backend"

git add backend/auth-service/authentication/views.py backend/auth-service/authentication/urls.py
git commit -m "feat(backend): build auth REST API endpoints"

git rm -r --cached backend/authentication backend/config backend/manage.py 2>/dev/null || true
git add backend/
git commit -m "refactor(backend): decouple authentication service from monolith"

git add README.md
git commit -m "docs: update project README for SplitSpace"

git add .
git commit -m "chore: final cleanup and formatting"

git push origin master
