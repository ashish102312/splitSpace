# pyrefly: ignore [missing-import]
from django.apps import AppConfig  # type: ignore  # pyrefly: ignore


class AuthenticationConfig(AppConfig):
    name = 'authentication'
