import re
from django.core.mail import send_mail

from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

from notifications.models import Notification
from internships.models import Internship

from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsCoordinatorOrAdmin


def normalize_department_value(value):
    if value is None:
        return ""
    normalized = value.strip().lower().replace("&", "and")
    normalized = re.sub(r"[^a-z0-9]+", "", normalized)
    aliases = {
        "cse": "cse",
        "computerscienceengineering": "cse",
        "computerscienceandengineering": "cse",
        "it": "it",
        "informationtechnology": "it",
    }
    return aliases.get(normalized, normalized)


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

        if hasattr(application, "remarks") and "remarks" in serializer.validated_data:
            application.remarks = serializer.validated_data["remarks"]
            application.save(update_fields=["remarks"])

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

            if application.student.user.email:
                send_mail(
                    "Internship Application Approved",
                    f"Your internship application for {application.company_name} has been approved.",
                    "noreply@studentinternship.local",
                    [application.student.user.email],
                    fail_silently=True,
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

            if application.student.user.email:
                send_mail(
                    "Internship Application Rejected",
                    f"Your internship application for {application.company_name} has been rejected.",
                    "noreply@studentinternship.local",
                    [application.student.user.email],
                    fail_silently=True,
                )


class ApplicationReviewListView(generics.ListAPIView):

    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    def get_queryset(self):
        return Application.objects.all().order_by("-applied_at")