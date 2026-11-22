from django.urls import path, include  # type: ignore  # pyrefly: ignore

urlpatterns = [
    path('api/personal-expenses/', include('personal_expenses_app.urls')),
]
