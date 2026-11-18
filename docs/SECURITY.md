# SplitSpace — Security Policy & Guidelines

This document outlines the security architecture, data protection controls, and known limitations of SplitSpace.

---

## 🔒 Security Architecture

### 1. Authentication & Token Management
* **Algorithm**: HMAC-SHA256 (`HS256`) signed JSON Web Tokens.
* **Separation of Tokens**: Short-lived Access Tokens (15-60 min) for API authorization and Refresh Tokens for secure re-authentication.
* **Challenge Responses**: Protected endpoints return standard `WWW-Authenticate: Bearer` challenge headers resulting in HTTP `401 Unauthorized` responses on missing or expired tokens.
* **Password Hashing**: User passwords are encrypted using Django's PBKDF2 with SHA-256 hash algorithm before database persistence. Plaintext passwords are never stored or returned in user objects.

### 2. Authorization & Data Isolation
* **Personal Expenses**: Every personal expense query in `expense-service` is strictly filtered by the authenticated caller's `user_id`:
  ```python
  query = {"user_id": user_id}
  ```
  Users cannot query, modify, or delete another user's personal expenses even if they guess the UUID.
* **Group Resources**: All group actions (viewing rosters, listing group expenses, submitting splits, computing balances) verify group membership:
  ```python
  if not any(m["user_id"] == user_id for m in group["members"]):
      raise HTTPException(status_code=403, detail="Not a member of this group")
  ```

### 3. Secrets Management
* Production deployments must configure `JWT_SECRET` via environment variables.
* Template `.env.example` files with non-production safe values are provided for local development. Real secrets must never be committed to git.

---

## ⚠️ Known Limitations & Future Hardening

1. **Shared Secret vs Asymmetric Key Pairs**: The microservices currently utilize a symmetric shared secret (`HS256`). For large distributed deployments, upgrading to asymmetric `RS256` (public/private key pair) where only the Auth Service holds the private key is recommended.
2. **Rate Limiting**: The API Gateway currently does not enforce IP-based rate limiting on `/api/auth/login/`. Adding Redis-backed rate limiting (e.g., Slowapi or NGINX) is planned for high-concurrency production deployments.
3. **Token Revocation Blacklist**: Currently, tokens expire naturally based on `exp` claims. A shared Redis token denylist can be introduced for immediate token invalidation on explicit logout.
