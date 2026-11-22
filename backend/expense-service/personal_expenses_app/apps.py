from django.apps import AppConfig  # type: ignore  # pyrefly: ignore

class PersonalExpensesAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'personal_expenses_app'
