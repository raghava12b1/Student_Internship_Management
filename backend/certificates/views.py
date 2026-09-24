import re

from django.core.mail import send_mail

from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from notifications.models import Notification
from internships.models import Internship
from applications.permissions import IsCoordinatorOrAdmin

from .models import Certificate
from .serializers import CertificateSerializer


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


class MyCertificateListView(generics.ListAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(
            internship__student=self.request.user.student_profile
        ).order_by("-issue_date")


class MyCertificateCreateView(generics.CreateAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def perform_create(self, serializer):
        internship_id = self.request.data.get("internship")

        if not internship_id:
            raise serializers.ValidationError(
                "Internship is required."
            )

        try:
            internship = Internship.objects.get(
                id=internship_id,
                student=self.request.user.student_profile
            )
        except Internship.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid internship."
            )

        serializer.save(
            internship=internship
        )


class CertificateVerificationView(generics.UpdateAPIView):
    serializer_class = CertificateSerializer

    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    http_method_names = ["patch"]

    def get_queryset(self):
        queryset = Certificate.objects.select_related("internship", "internship__student", "internship__student__user").all()
        if self.request.user.role == "COORDINATOR":
            if not hasattr(self.request.user, "coordinator_profile"):
                return Certificate.objects.none()
            department = normalize_department_value(self.request.user.coordinator_profile.department)
            return [
                certificate for certificate in queryset
                if normalize_department_value(certificate.internship.student.department) == department
            ]
        return queryset

    def perform_update(self, serializer):
        is_verified = serializer.validated_data.get("is_verified", True)
        certificate = serializer.save(is_verified=is_verified)

        if is_verified:
            title = "Certificate Verified"
            message = (
                f"Your certificate "
                f"{certificate.certificate_number} "
                f"has been verified."
            )
        else:
            title = "Certificate Rejected"
            message = (
                f"Your certificate "
                f"{certificate.certificate_number} "
                f"has been rejected."
            )

        Notification.objects.create(
            recipient=certificate.internship.student,
            title=title,
            message=message,
        )

        if certificate.internship.student.user.email:
            send_mail(
                title,
                message,
                "noreply@studentinternship.local",
                [certificate.internship.student.user.email],
                fail_silently=True,
            )
