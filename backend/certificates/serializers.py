from rest_framework import serializers

from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = [
            "id",
            "internship",
            "certificate_number",
            "issue_date",
            "certificate_file",
            "is_verified",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "is_verified",
            "created_at",
        ]