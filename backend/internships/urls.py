from django.urls import path

from .views import MyInternshipListCreateView,MyInternshipDetailView


urlpatterns = [
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