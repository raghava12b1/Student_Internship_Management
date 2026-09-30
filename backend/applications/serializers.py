from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.student_name", read_only=True)
    roll_number = serializers.CharField(source="student.roll_number", read_only=True)
    department = serializers.CharField(source="student.department", read_only=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "student_name",
            "roll_number",
            "department",
            "company_name",
            "role",
            "location",
            "company_url",
            "start_date",
            "end_date",
            "mode",
            "description",
            "status",
            "remarks",
            "applied_at",
        ]
        read_only_fields = [
            "id",
            "applied_at",
        ]