from django.contrib import admin  # type: ignore  # pyrefly: ignore
from django.urls import path, include  # type: ignore  # pyrefly: ignore

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
]
