import re

from django.core.mail import send_mail

from rest_framework import generics, serializers, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from applications.permissions import IsCoordinatorOrAdmin
from notifications.models import Notification
from internships.models import Internship

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

        # The serializer's `internship` field is read_only (nested for output),
        # so it is never present in validated_data. Resolve it manually from
        # request.data and validate it here, then pass it into serializer.save().
        internship_id = self.request.data.get("internship")

        if not internship_id:
            raise serializers.ValidationError(
                "Internship is required."
            )

        try:
            internship = Internship.objects.get(id=internship_id)
        except Internship.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid internship."
            )

        document_type = serializer.validated_data["document_type"]

        # Make sure internship belongs to logged-in student
        if internship.student != self.request.user.student_profile:
            raise serializers.ValidationError(
                "You can only upload documents for your own internship."
            )

        # Allowed document types
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
            student=self.request.user.student_profile,
            internship=internship,
        )


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
        return Document.objects.all()

    def perform_update(self, serializer):

        document_status = serializer.validated_data.get("status")

        if document_status not in [
            Document.Status.APPROVED,
            Document.Status.REJECTED,
        ]:
            raise serializers.ValidationError(
                "Document can only be approved or rejected."
            )

        document = serializer.save()

        document_name = document.get_document_type_display()

        if document_status == Document.Status.APPROVED:

            Notification.objects.create(
                recipient=document.student,
                title="Document Approved",
                message=(
                    f"Your {document_name} has been approved."
                ),
            )

            if document.student.user.email:
                send_mail(
                    "Document Approved",
                    f"Your {document_name} has been approved.",
                    "noreply@studentinternship.local",
                    [document.student.user.email],
                    fail_silently=True,
                )

        elif document_status == Document.Status.REJECTED:

            Notification.objects.create(
                recipient=document.student,
                title="Document Rejected",
                message=(
                    f"Your {document_name} has been rejected."
                ),
            )

            if document.student.user.email:
                send_mail(
                    "Document Rejected",
                    f"Your {document_name} has been rejected.",
                    "noreply@studentinternship.local",
                    [document.student.user.email],
                    fail_silently=True,
                )


# =========================================================
# COORDINATOR / ADMIN - ALL DOCUMENTS
# =========================================================

class DocumentReviewListView(generics.ListAPIView):

    serializer_class = DocumentSerializer

    permission_classes = [
        IsAuthenticated,
        IsCoordinatorOrAdmin,
    ]

    def get_queryset(self):
        queryset = Document.objects.select_related("student", "student__user", "internship").all().order_by("-uploaded_at")
        if self.request.user.role == "COORDINATOR":
            if not hasattr(self.request.user, "coordinator_profile"):
                return Document.objects.none()
            department = normalize_department_value(self.request.user.coordinator_profile.department)
            return [
                document for document in queryset
                if normalize_department_value(document.student.department) == department
            ]
        return queryset


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

        # -----------------------------------------
        # VALIDATION
        # -----------------------------------------

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

        # -----------------------------------------
        # CHECK FILE TYPE
        # -----------------------------------------

        if file.content_type != "application/pdf":
            raise serializers.ValidationError(
                "Final Report must be a PDF file."
            )

        # -----------------------------------------
        # GET STUDENT INTERNSHIP
        # -----------------------------------------

        try:

            internship = Internship.objects.get(
                id=internship_id,
                student=request.user.student_profile
            )

        except Internship.DoesNotExist:

            raise serializers.ValidationError(
                "Invalid internship."
            )

        # -----------------------------------------
        # CREATE DOCUMENT
        # -----------------------------------------

        document = Document.objects.create(

            student=request.user.student_profile,

            internship=internship,

            document_type=Document.DocumentType.FINAL_REPORT,

            file=file,

        )

        # -----------------------------------------
        # CREATE FINAL REPORT
        # -----------------------------------------

        final_report = FinalReport.objects.create(

            internship=internship,

            document=document,

            summary=summary.strip(),

            skills=skills.strip(),

        )

        # -----------------------------------------
        # RETURN RESPONSE
        # -----------------------------------------

        serializer = self.get_serializer(final_report)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )