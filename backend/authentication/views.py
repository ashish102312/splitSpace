from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from .utils import generate_tokens, decode_token
import re

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        payload = decode_token(token)

        if not payload or payload.get('type') != 'access':
            raise AuthenticationFailed('Invalid or expired token')

        user_data = User.get_by_id(payload['user_id'])
        if not user_data:
            raise AuthenticationFailed('User not found')

        return (user_data, token)

class RegisterView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        if not name or not email or not password:
            return Response({"success": False, "message": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not is_valid_email(email):
            return Response({"success": False, "message": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_data = User.create(name=name, email=email, password=password)
            return Response({"success": True, "message": "Registration successful"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_409_CONFLICT)
        except Exception:
            return Response({"success": False, "message": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"success": False, "message": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        user_data = User.get_by_email(email)
        if not user_data or not User.check_password(user_data, password):
            return Response({"success": False, "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = generate_tokens(user_data['_id'])
        return Response({
            "success": True,
            "tokens": tokens
        }, status=status.HTTP_200_OK)

class MeView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user_data = request.user
        return Response({
            "id": user_data["_id"],
            "name": user_data["name"],
            "email": user_data["email"],
            "role": user_data.get("role", "USER")
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        # We can implement token blacklisting here if desired.
        # For this basic implementation, we just return success and let the frontend discard the token.
        return Response({"success": True, "message": "Logged out successfully"}, status=status.HTTP_200_OK)
