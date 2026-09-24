from rest_framework import serializers

from accounts.models import StudentProfile
from internships.models import Internship
from .models import Document, FinalReport


class StudentMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "student_name",
            "roll_number",
            "department",
            "year",
            "semester",
            "mobile_number",
        ]


class InternshipMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        fields = [
            "id",
            "company_name",
            "role",
            "start_date",
            "end_date",
            "status",
        ]


class DocumentSerializer(serializers.ModelSerializer):
    student = StudentMiniSerializer(read_only=True)
    student_name = serializers.SerializerMethodField()
    roll_number = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    internship = InternshipMiniSerializer(read_only=True)
    document_type_display = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            "student",
            "student_name",
            "roll_number",
            "department",
            "internship",
            "document_type",
            "document_type_display",
            "file",
            "file_url",
            "status",
            "remarks",
            "uploaded_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "student_name",
            "roll_number",
            "department",
            "internship",
            "document_type_display",
            "file_url",
            "uploaded_at",
        ]

    def get_student_name(self, obj):
        return getattr(obj.student, "student_name", "")

    def get_roll_number(self, obj):
        return getattr(obj.student, "roll_number", "")

    def get_department(self, obj):
        return getattr(obj.student, "department", "")

    def get_document_type_display(self, obj):
        return obj.get_document_type_display()

    def get_file_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return None
        return request.build_absolute_uri(obj.file.url) if request else obj.file.url


class FinalReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = FinalReport

        fields = [
            "id",
            "internship",
            "document",
            "summary",
            "skills",
            "submitted_at",
        ]

        read_only_fields = [
            "id",
            "document",
            "submitted_at",
        ]