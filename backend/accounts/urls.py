from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    StudentProfileListCreateView,
    StudentRegistrationView,
    MyProfileView,
    StudentDashboardView,
    CoordinatorDashboardView,
    AdminDashboardView,
    CustomTokenObtainPairView,
)


urlpatterns = [

    path(
        "students/",
        StudentProfileListCreateView.as_view(),
        name="student-list-create",
    ),

    path(
        "register/",
        StudentRegistrationView.as_view(),
        name="student-register",
    ),

    path(
        "login/",
        CustomTokenObtainPairView.as_view(),
        name="token-obtain-pair",
    ),

    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),

    path(
        "profile/",
        MyProfileView.as_view(),
        name="my-profile",
    ),

    path(
        "dashboard/",
        StudentDashboardView.as_view(),
        name="student-dashboard",
    ),

    path(
        "coordinator-dashboard/",
        CoordinatorDashboardView.as_view(),
        name="coordinator-dashboard",
    ),

    path(
        "admin-dashboard/",
        AdminDashboardView.as_view(),
        name="admin-dashboard",
    ),
]