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