# pyrefly: ignore [missing-import]
from rest_framework.authentication import BaseAuthentication  # type: ignore  # pyrefly: ignore
# pyrefly: ignore [missing-import]
from rest_framework.exceptions import AuthenticationFailed  # type: ignore  # pyrefly: ignore
from .models import User  # type: ignore  # pyrefly: ignore
from .utils import decode_token  # type: ignore  # pyrefly: ignore

class AuthenticatedUser(dict):
    @property
    def is_authenticated(self):
        return True

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        payload = decode_token(token, token_type='access')

        if not payload:
            raise AuthenticationFailed('Invalid or expired token')

        user_data = User.get_by_id(payload['user_id'])
        if not user_data:
            raise AuthenticationFailed('User not found')

        # Remove password from request.user
        user_data.pop('password', None)
        return (AuthenticatedUser(user_data), token)

    def authenticate_header(self, request):
        return 'Bearer'
