from django.db import transaction
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
        student = self.request.user.student_profile
        company_name = serializer.validated_data.get("company_name")
        role = serializer.validated_data.get("role")

        if Application.objects.filter(
            student=student, 
            company_name__iexact=company_name, 
            role__iexact=role, 
            status__in=[Application.Status.PENDING, Application.Status.APPROVED]
        ).exists():
            raise serializers.ValidationError(
                {"detail": "You already have a pending or approved application for this company and role."}
            )

        serializer.save(
            student=student
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

        new_status = serializer.validated_data.get("status")

        if new_status not in [
            Application.Status.APPROVED,
            Application.Status.REJECTED,
        ]:
            raise serializers.ValidationError(
                "Application can only be approved or rejected."
            )

        instance = self.get_object()
        old_status = instance.status

        application = serializer.save()

        if hasattr(application, "remarks") and "remarks" in serializer.validated_data:
            application.remarks = serializer.validated_data["remarks"]
            application.save(update_fields=["remarks"])

        if new_status == Application.Status.APPROVED:
            with transaction.atomic():
                internship, created = Internship.objects.get_or_create(
                    student=application.student,
                    company_name=application.company_name,
                    role=application.role,
                    defaults={
                        "start_date": application.start_date,
                        "end_date": application.end_date,
                    },
                )
                
                if not created:
                    internship.start_date = application.start_date
                    internship.end_date = application.end_date
                    internship.save(update_fields=["start_date", "end_date"])

            if old_status != new_status:
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

        elif new_status == Application.Status.REJECTED:
            if old_status == Application.Status.APPROVED:
                Internship.objects.filter(
                    student=application.student,
                    company_name=application.company_name,
                    role=application.role
                ).update(status=Internship.Status.REJECTED)

            if old_status != new_status:
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
        queryset = Application.objects.all().order_by("-applied_at")

        if self.request.user.role == "COORDINATOR":
            if not hasattr(self.request.user, "coordinator_profile"):
                return Application.objects.none()

            dept = normalize_department_value(
                self.request.user.coordinator_profile.department
            )

            matching_ids = [
                app.id for app in queryset
                if normalize_department_value(app.student.department) == dept
            ]

            return queryset.filter(id__in=matching_ids)

        return queryset