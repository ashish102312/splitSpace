from django.urls import path, re_path  # type: ignore  # pyrefly: ignore
from .views import (  # type: ignore  # pyrefly: ignore
    GroupListCreateView,
    GroupDetailView,
    JoinGroupView,
    GroupBalancesView,
)

urlpatterns = [
    re_path(r'^/?$', GroupListCreateView.as_view(), name='group-list-create'),
    re_path(r'^join/?$', JoinGroupView.as_view(), name='group-join'),
    re_path(r'^(?P<group_id>[^/]+)/?$', GroupDetailView.as_view(), name='group-detail'),
    re_path(r'^(?P<group_id>[^/]+)/balances/?$', GroupBalancesView.as_view(), name='group-balances'),
]
