from django.urls import path

from .views import (
    MyApplicationListCreateView,
    MyApplicationDetailView,
    ApplicationReviewView,
    ApplicationReviewListView,
)


urlpatterns = [
    path(
        "",
        MyApplicationListCreateView.as_view(),
        name="my-applications",
    ),

    path(
        "review/",
        ApplicationReviewListView.as_view(),
        name="application-review-list",
    ),

    path(
        "<int:pk>/",
        MyApplicationDetailView.as_view(),
        name="my-application-detail",
    ),

    path(
        "<int:pk>/review/",
        ApplicationReviewView.as_view(),
        name="application-review",
    ),
]