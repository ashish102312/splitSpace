from fastapi import Depends, HTTPException, status  # type: ignore  # pyrefly: ignore
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials  # type: ignore  # pyrefly: ignore
import jwt  # type: ignore  # pyrefly: ignore
import os  # type: ignore  # pyrefly: ignore
from dotenv import load_dotenv  # type: ignore  # pyrefly: ignore

load_dotenv()

security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwtkey_replace_me_in_production")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("type") != "access":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        return payload.get("user_id")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
