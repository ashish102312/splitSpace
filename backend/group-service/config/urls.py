from django.urls import path, include  # type: ignore  # pyrefly: ignore

urlpatterns = [
    path('api/groups/', include('groups_app.urls_groups')),
    path('api/expenses/', include('groups_app.urls_expenses')),
]
