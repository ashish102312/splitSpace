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

from .auth_backend import JWTAuthentication

def success_response(message, data=None, status_code=status.HTTP_200_OK):
    res = {"success": True, "message": message}
    if data is not None:
        res["data"] = data
    return Response(res, status=status_code)

def error_response(message, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    res = {"success": False, "message": message}
    if errors is not None:
        res["errors"] = errors
    return Response(res, status=status_code)

class RegisterView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm = request.data.get('confirmPassword')

        if not name or not email or not password:
            return error_response("All fields are required")

        if password != confirm:
            return error_response("Passwords do not match")

        if not is_valid_email(email):
            return error_response("Invalid email format")

        if len(password) < 6:
            return error_response("Password must be at least 6 characters long")

        try:
            user_data = User.create(name=name, email=email, password=password)
            user_data.pop('password', None)
            return success_response("Registration successful", data=user_data, status_code=status.HTTP_201_CREATED)
        except ValueError as e:
            return error_response(str(e), status_code=status.HTTP_409_CONFLICT)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return error_response("Internal server error", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return error_response("Email and password required")

        user_data = User.get_by_email(email)
        if not user_data or not User.check_password(user_data, password):
            return error_response("Invalid credentials", status_code=status.HTTP_401_UNAUTHORIZED)

        tokens = generate_tokens(user_data['id'])
        user_data.pop('password', None)
        return success_response("Login successful", data={"user": user_data, "tokens": tokens})

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return error_response("Refresh token required")

        payload = decode_token(refresh_token, token_type='refresh')
        if not payload:
            return error_response("Invalid or expired refresh token", status_code=status.HTTP_401_UNAUTHORIZED)
            
        user_data = User.get_by_id(payload['user_id'])
        if not user_data:
            return error_response("User not found", status_code=status.HTTP_401_UNAUTHORIZED)
            
        tokens = generate_tokens(user_data['id'])
        return success_response("Token refreshed", data={"tokens": tokens})

class MeView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return success_response("User profile retrieved", data=request.user)

class UpdateProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def put(self, request):
        name = request.data.get('name')
        if not name:
            return error_response("Name is required")
            
        updated_user = User.update(request.user['id'], {"name": name})
        updated_user.pop('password', None)
        
        return success_response("Profile updated successfully", data=updated_user)

class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        
        if not current_password or not new_password:
            return error_response("Both current and new passwords are required")
            
        # Get full user doc to check password
        user_doc = User.get_by_id(request.user['id'])
        
        if not User.check_password(user_doc, current_password):
            return error_response("Incorrect current password", status_code=status.HTTP_401_UNAUTHORIZED)
            
        if len(new_password) < 6:
            return error_response("New password must be at least 6 characters long")
            
        User.update(request.user['id'], {"password": new_password})
        
        return success_response("Password changed successfully")

class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        # We can implement token blacklisting here in the future
        return success_response("Logged out successfully")
