# pyrefly: ignore [missing-import]
import jwt
import os
from datetime import datetime, timedelta, timezone

def generate_tokens(user_id):
    secret = os.getenv("JWT_SECRET", "fallback_secret")
    
    access_exp = datetime.now(timezone.utc) + timedelta(minutes=60)
    refresh_exp = datetime.now(timezone.utc) + timedelta(days=7)

    access_token = jwt.encode(
        {"user_id": user_id, "exp": access_exp, "type": "access"},
        secret,
        algorithm="HS256"
    )

    refresh_token = jwt.encode(
        {"user_id": user_id, "exp": refresh_exp, "type": "refresh"},
        secret,
        algorithm="HS256"
    )

    return {
        "access": access_token,
        "refresh": refresh_token
    }

def decode_token(token, token_type=None):
    secret = os.getenv("JWT_SECRET", "fallback_secret")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        if token_type and payload.get("type") != token_type:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
