import jwt  # type: ignore  # pyrefly: ignore
import os  # type: ignore  # pyrefly: ignore
from rest_framework.authentication import BaseAuthentication  # type: ignore  # pyrefly: ignore
from rest_framework.exceptions import AuthenticationFailed  # type: ignore  # pyrefly: ignore

class AuthenticatedUser(dict):
    @property
    def is_authenticated(self):
        return True
    
    @property
    def id(self):
        return self.get("id")

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        secret = os.getenv("JWT_SECRET", "fallback_secret")
        
        try:
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            if payload.get("type") != "access":
                raise AuthenticationFailed("Invalid token type")
            user_id = payload.get("user_id")
            if not user_id:
                raise AuthenticationFailed("Invalid token payload")
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        # In microservices, we attach the user_id payload
        user_data = {"id": user_id, "user_id": user_id}
        return (AuthenticatedUser(user_data), token)

    def authenticate_header(self, request):
        return 'Bearer'
