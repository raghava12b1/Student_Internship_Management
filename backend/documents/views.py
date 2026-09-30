
import re

from django.core.mail import send_mail
from django.db import transaction

from rest_framework import generics, serializers, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from applications.permissions import IsCoordinatorOrAdmin
from notifications.models import Notification
from internships.models import Internship
from certificates.models import Certificate

from .models import Document, FinalReport
from .serializers import DocumentSerializer, FinalReportSerializer


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
# STUDENT - DOCUMENT LIST / CREATE
# =========================================================

class MyDocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Document.objects.filter(
            student=self.request.user.student_profile
        ).order_by("-uploaded_at")

    def perform_create(self, serializer):
        internship_id = self.request.data.get("internship")

        if not internship_id:
            raise serializers.ValidationError(
                {"internship": "Internship is required."}
            )

        try:
            internship = Internship.objects.get(id=internship_id)
        except Internship.DoesNotExist:
            raise serializers.ValidationError(
                {"internship": "Invalid internship."}
            )

        document_type = serializer.validated_data["document_type"]
        student = self.request.user.student_profile

        if internship.student != student:
            raise serializers.ValidationError(
                "You can only upload documents for your own internship."
            )

        allowed_types = [
            Document.DocumentType.OFFER_LETTER,
            Document.DocumentType.FINAL_REPORT,
            Document.DocumentType.CERTIFICATE,
        ]

        if document_type not in allowed_types:
            raise serializers.ValidationError(
                "Invalid document type."
            )

        serializer.save(
            student=student,
            internship=internship,
        )

        # Mark internship completed when certificate is submitted.
        if document_type == Document.DocumentType.CERTIFICATE:
            internship.status = Internship.Status.COMPLETED
            internship.save(update_fields=["status"])

# =========================================================
# COORDINATOR / ADMIN - DOCUMENT REVIEW
# =========================================================

class DocumentReviewView(generics.UpdateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Document.objects.select_related(
            "student",
            "student__user",
            "internship",
        ).filter(
            status=Document.Status.PENDING
        )

    def perform_update(self, serializer):
        document_status = serializer.validated_data.get("status")

        if document_status not in [
            Document.Status.APPROVED,
            Document.Status.REJECTED,
        ]:
            raise serializers.ValidationError({
                "status": "Document can only be approved or rejected."
            })

        document = serializer.save()

        # Keep the Certificate record in sync.
        if document.document_type == Document.DocumentType.CERTIFICATE:
            Certificate.objects.filter(
                internship=document.internship
            ).update(
                is_verified=(
                    document_status == Document.Status.APPROVED
                )
            )

        document_name = document.get_document_type_display()

        if document_status == Document.Status.APPROVED:
            title = "Document Approved"
            message = f"Your {document_name} has been approved."
        else:
            title = "Document Rejected"
            message = f"Your {document_name} has been rejected."

        Notification.objects.create(
            recipient=document.student,
            title=title,
            message=message,
        )

        if document.student.user.email:
            send_mail(
                title,
                message,
                "noreply@studentinternship.local",
                [document.student.user.email],
                fail_silently=True,
            )

# =========================================================
# COORDINATOR / ADMIN - PENDING DOCUMENTS
# =========================================================


class DocumentReviewListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    def get_queryset(self):
        queryset = Document.objects.select_related(
            "student",
            "student__user",
            "internship",
        ).order_by("-uploaded_at")

        # By default, show only pending documents.
        # Reports can request all document statuses.
        document_status = self.request.query_params.get(
            "status", "PENDING"
        ).strip().upper()

        if document_status != "ALL":
            valid_statuses = [
                choice[0]
                for choice in Document.Status.choices
            ]

            if document_status not in valid_statuses:
                return Document.objects.none()

            queryset = queryset.filter(status=document_status)

        # Filter by document type when provided.
        document_type = self.request.query_params.get(
            "document_type"
        )

        valid_types = [
            choice[0]
            for choice in Document.DocumentType.choices
        ]

        if document_type:
            document_type = document_type.strip().upper()

            if document_type not in valid_types:
                return Document.objects.none()

            queryset = queryset.filter(
                document_type=document_type
            )

        return queryset


# =========================================================
# COORDINATOR / ADMIN - STUDENT DOCUMENTS
# =========================================================

class CoordinatorStudentDocumentsView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    def get_queryset(self):
        student_id = self.kwargs["student_id"]

        return Document.objects.select_related(
            "student",
            "student__user",
            "internship",
        ).filter(
            student_id=student_id
        ).order_by("-uploaded_at")


# =========================================================
# STUDENT - FINAL REPORT CREATE
# =========================================================

class FinalReportCreateView(generics.CreateAPIView):
    serializer_class = FinalReportSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def create(self, request, *args, **kwargs):
        internship_id = request.data.get("internship")
        summary = request.data.get("summary")
        skills = request.data.get("skills")
        file = request.FILES.get("file")

        # VALIDATION

        if not internship_id:
            raise serializers.ValidationError(
                "Internship is required."
            )

        if not summary or not summary.strip():
            raise serializers.ValidationError(
                "Internship summary is required."
            )

        if not skills or not skills.strip():
            raise serializers.ValidationError(
                "Skills are required."
            )

        if not file:
            raise serializers.ValidationError(
                "Final Report PDF is required."
            )

        # CHECK FILE TYPE

        if file.content_type != "application/pdf":
            raise serializers.ValidationError(
                "Final Report must be a PDF file."
            )

        # GET STUDENT INTERNSHIP

        try:
            internship = Internship.objects.get(
                id=internship_id,
                student=request.user.student_profile,
            )
        except Internship.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid internship."
            )

        # CREATE DOCUMENT AND FINAL REPORT

        with transaction.atomic():
            document = Document.objects.create(
                student=request.user.student_profile,
                internship=internship,
                document_type=Document.DocumentType.FINAL_REPORT,
                file=file,
            )

            final_report = FinalReport.objects.create(
                internship=internship,
                document=document,
                summary=summary.strip(),
                skills=skills.strip(),
            )

        # RETURN RESPONSE

        serializer = self.get_serializer(final_report)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )
