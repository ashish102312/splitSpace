from django.urls import path, re_path  # type: ignore  # pyrefly: ignore
from .views import (  # type: ignore  # pyrefly: ignore
    ExpenseListCreateView,
    GroupExpensesListView,
)

urlpatterns = [
    re_path(r'^/?$', ExpenseListCreateView.as_view(), name='expense-create'),
    re_path(r'^group/(?P<group_id>[^/]+)/?$', GroupExpensesListView.as_view(), name='group-expenses'),
]
