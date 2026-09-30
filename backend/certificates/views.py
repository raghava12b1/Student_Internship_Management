import re

from django.db import transaction

from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from documents.models import Document
from internships.models import Internship
from notifications.models import Notification
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


# =========================================================
# STUDENT - CERTIFICATE LIST
# =========================================================

class MyCertificateListView(generics.ListAPIView):

    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(
            internship__student=self.request.user.student_profile
        ).order_by("-issue_date")


# =========================================================
# STUDENT - CERTIFICATE UPLOAD
# =========================================================


class MyCertificateCreateView(generics.CreateAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        internship_id = request.data.get("internship")

        if not internship_id:
            raise serializers.ValidationError({
                "internship": "Internship is required."
            })

        try:
            internship = Internship.objects.get(
                id=internship_id,
                student=request.user.student_profile
            )
        except Internship.DoesNotExist:
            raise serializers.ValidationError({
                "internship": "Invalid internship."
            })

        existing_certificate = Certificate.objects.filter(
            internship=internship
        ).first()

        existing_document = Document.objects.filter(
            internship=internship,
            document_type=Document.DocumentType.CERTIFICATE
        ).order_by("-uploaded_at").first()

        # If a certificate already exists, allow resubmission
        # only when its document was rejected.
        if existing_certificate and existing_document:
            if existing_document.status != Document.Status.REJECTED:
                raise serializers.ValidationError({
                    "certificate": (
                        "Your certificate is already pending "
                        "or has already been approved."
                    )
                })

        # Update the rejected certificate, or create a new one.
        if existing_certificate:
            serializer = self.get_serializer(
                existing_certificate,
                data=request.data
            )
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        certificate = serializer.save(
            internship=internship,
            is_verified=False
        )

        if existing_document:
            # Reuse the rejected document.
            existing_document.file = certificate.certificate_file.name
            existing_document.status = Document.Status.PENDING
            existing_document.remarks = ""
            existing_document.save(
                update_fields=["file", "status", "remarks"]
            )
        else:
            # Create a document for the new certificate.
            Document.objects.create(
                student=request.user.student_profile,
                internship=internship,
                document_type=Document.DocumentType.CERTIFICATE,
                file=certificate.certificate_file.name,
                status=Document.Status.PENDING,
            )

        return Response(
            serializer.data,
            status=(
                status.HTTP_200_OK
                if existing_certificate
                else status.HTTP_201_CREATED
            )
        )


# =========================================================
# COORDINATOR / ADMIN - CERTIFICATE VERIFICATION
# =========================================================

class CertificateVerificationView(generics.UpdateAPIView):

    serializer_class = CertificateSerializer

    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    http_method_names = ["patch"]

    def get_queryset(self):

        queryset = Certificate.objects.select_related(
            "internship",
            "internship__student",
            "internship__student__user",
        ).all()

        if self.request.user.role == "COORDINATOR":

            if not hasattr(
                self.request.user,
                "coordinator_profile"
            ):
                return Certificate.objects.none()

            department = normalize_department_value(
                self.request.user.coordinator_profile.department
            )

            return [
                certificate
                for certificate in queryset
                if normalize_department_value(
                    certificate.internship.student.department
                ) == department
            ]

        return queryset

    def perform_update(self, serializer):

        is_verified = serializer.validated_data.get(
            "is_verified",
            True
        )

        certificate = serializer.save(
            is_verified=is_verified
        )

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