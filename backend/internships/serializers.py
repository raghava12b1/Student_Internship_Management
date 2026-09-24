from rest_framework import serializers

from .models import Internship


class InternshipSerializer(serializers.ModelSerializer):

    class Meta:
        model = Internship

        fields = [
            "id",
            "company_name",
            "role",
            "company_address",
            "internship_type",
            "start_date",
            "end_date",
            "stipend",
            "hr_name",
            "hr_email",
            "hr_phone",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]


class AdminInternshipSerializer(InternshipSerializer):
    class Meta(InternshipSerializer.Meta):
        read_only_fields = ["id", "created_at"]


class ReportInternshipSerializer(serializers.ModelSerializer):

    student_name = serializers.CharField(
        source="student.student_name",
        read_only=True
    )

    roll_number = serializers.CharField(
        source="student.roll_number",
        read_only=True
    )

    department = serializers.CharField(
        source="student.department",
        read_only=True
    )

    year = serializers.IntegerField(
        source="student.year",
        read_only=True
    )

    class Meta:
        model = Internship

        fields = [
            "id",
            "student_name",
            "roll_number",
            "department",
            "year",
            "company_name",
            "role",
            "company_address",
            "internship_type",
            "start_date",
            "end_date",
            "stipend",
            "status",
            "created_at",
        ]