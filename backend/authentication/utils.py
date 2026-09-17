import jwt
import os
from datetime import datetime, timedelta, timezone

def generate_tokens(user_id):
    secret = os.getenv("JWT_SECRET", "fallback_secret")
    access_lifetime = int(os.getenv("JWT_ACCESS_TOKEN_LIFETIME", 60))
    refresh_lifetime = int(os.getenv("JWT_REFRESH_TOKEN_LIFETIME", 1440))

    access_exp = datetime.now(timezone.utc) + timedelta(minutes=access_lifetime)
    refresh_exp = datetime.now(timezone.utc) + timedelta(minutes=refresh_lifetime)

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

def decode_token(token):
    secret = os.getenv("JWT_SECRET", "fallback_secret")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
