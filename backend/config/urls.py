"""
URL configuration for config project.
"""

from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # API endpoints
    path("api/accounts/", include("accounts.urls")),
    path("api/internships/", include("internships.urls")),
    path("api/documents/", include("documents.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/applications/", include("applications.urls")),
    path("api/certificates/", include("certificates.urls")),
]

# Serve uploaded media files during development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )