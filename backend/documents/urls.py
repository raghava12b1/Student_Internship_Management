from django.urls import path

from .views import (
    MyDocumentListCreateView,
    DocumentReviewView,
    DocumentReviewListView,
    FinalReportCreateView,
    CoordinatorStudentDocumentsView,
)

urlpatterns = [
    path(
        "",
        MyDocumentListCreateView.as_view(),
        name="my-documents",
    ),
    path(
        "final-report/",
        FinalReportCreateView.as_view(),
        name="final-report-create",
    ),
    path(
        "review/",
        DocumentReviewListView.as_view(),
        name="document-review-list",
    ),
    path(
        "<int:pk>/review/",
        DocumentReviewView.as_view(),
        name="document-review",
    ),
    path(
        "student/<int:student_id>/",
        CoordinatorStudentDocumentsView.as_view(),
        name="coordinator-student-documents",
    ),
]