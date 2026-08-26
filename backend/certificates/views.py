from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from notifications.models import Notification
from internships.models import Internship
from applications.permissions import IsCoordinatorOrAdmin

from .models import Certificate
from .serializers import CertificateSerializer


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
        return Certificate.objects.all()

    def perform_update(self, serializer):
        certificate = serializer.save(
            is_verified=True
        )

        Notification.objects.create(
            recipient=certificate.internship.student,
            title="Certificate Verified",
            message=(
                f"Your certificate "
                f"{certificate.certificate_number} "
                f"has been verified."
            ),
        )