import os  # type: ignore  # pyrefly: ignore
from django.core.asgi import get_asgi_application  # type: ignore  # pyrefly: ignore

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
application = get_asgi_application()
