from django.urls import path, re_path  # type: ignore  # pyrefly: ignore
from .views import (  # type: ignore  # pyrefly: ignore
    PersonalExpenseListCreateView,
    PersonalExpenseDetailView,
    PersonalAnalyticsSummaryView,
)

urlpatterns = [
    re_path(r'^/?$', PersonalExpenseListCreateView.as_view(), name='personal-expense-list-create'),
    re_path(r'^analytics/summary/?$', PersonalAnalyticsSummaryView.as_view(), name='personal-analytics-summary'),
    re_path(r'^(?P<expense_id>[^/]+)/?$', PersonalExpenseDetailView.as_view(), name='personal-expense-detail'),
]
