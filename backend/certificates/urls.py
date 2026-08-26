from django.urls import path

from .views import (
    MyCertificateListView,
    MyCertificateCreateView,
    CertificateVerificationView,
)

urlpatterns = [
    path(
        "",
        MyCertificateListView.as_view(),
        name="my-certificates",
    ),
    path(
        "upload/",
        MyCertificateCreateView.as_view(),
        name="upload-certificate",
    ),
    path(
        "<int:pk>/verify/",
        CertificateVerificationView.as_view(),
        name="verify-certificate",
    ),
]