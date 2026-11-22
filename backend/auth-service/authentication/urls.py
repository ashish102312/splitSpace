from django.urls import path, re_path  # type: ignore  # pyrefly: ignore
from .views import (  # type: ignore  # pyrefly: ignore
    RegisterView, LoginView, RefreshTokenView, 
    MeView, UpdateProfileView, ChangePasswordView, LogoutView
)

urlpatterns = [
    re_path(r'^register/?$', RegisterView.as_view(), name='register'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^refresh/?$', RefreshTokenView.as_view(), name='refresh'),
    re_path(r'^token/refresh/?$', RefreshTokenView.as_view(), name='token_refresh'),
    re_path(r'^me/?$', MeView.as_view(), name='me'),
    re_path(r'^profile/?$', UpdateProfileView.as_view(), name='update_profile'),
    re_path(r'^change-password/?$', ChangePasswordView.as_view(), name='change_password'),
    re_path(r'^logout/?$', LogoutView.as_view(), name='logout'),
]
