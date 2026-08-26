from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from notifications.models import Notification
from internships.models import Internship

from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsCoordinatorOrAdmin


class MyApplicationListCreateView(generics.ListCreateAPIView):

    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            student=self.request.user.student_profile
        ).order_by("-applied_at")

    def perform_create(self, serializer):
        serializer.save(
            student=self.request.user.student_profile
        )


class MyApplicationDetailView(generics.RetrieveAPIView):

    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(
            student=self.request.user.student_profile
        )


class ApplicationReviewView(generics.UpdateAPIView):

    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    http_method_names = ["patch"]

    def get_queryset(self):
        return Application.objects.all()

    def perform_update(self, serializer):

        status = serializer.validated_data.get("status")

        if status not in [
            Application.Status.APPROVED,
            Application.Status.REJECTED,
        ]:
            raise serializers.ValidationError(
                "Application can only be approved or rejected."
            )

        application = serializer.save()

        if status == Application.Status.APPROVED:

            Internship.objects.get_or_create(
                student=application.student,
                company_name=application.company_name,
                role=application.role,
                defaults={
                    "start_date": application.start_date,
                    "end_date": application.end_date,
                },
            )

            Notification.objects.create(
                recipient=application.student,
                title="Internship Application Approved",
                message=(
                    f"Your internship application for "
                    f"{application.company_name} has been approved."
                ),
            )

        elif status == Application.Status.REJECTED:

            Notification.objects.create(
                recipient=application.student,
                title="Internship Application Rejected",
                message=(
                    f"Your internship application for "
                    f"{application.company_name} has been rejected."
                ),
            )


class ApplicationReviewListView(generics.ListAPIView):

    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    def get_queryset(self):
        return Application.objects.all().order_by("-applied_at")