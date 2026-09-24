from django.urls import path

from .views import (
    AdminCompanyDetailView,
    AdminCompanyListCreateView,
    AdminInternshipDetailView,
    MyInternshipListCreateView,
    MyInternshipDetailView,
)


urlpatterns = [
    path(
        "companies/",
        AdminCompanyListCreateView.as_view(),
        name="admin-company-list-create",
    ),
    path(
        "companies/<int:pk>/",
        AdminCompanyDetailView.as_view(),
        name="admin-company-detail",
    ),
    path(
        "admin/<int:pk>/",
        AdminInternshipDetailView.as_view(),
        name="admin-internship-detail",
    ),
    path(
        "",
        MyInternshipListCreateView.as_view(),
        name="my-internships",
    ),
    
    path(
        "<int:pk>/",
        MyInternshipDetailView.as_view(),
        name="my-internship-detail",
    ),
]