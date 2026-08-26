from rest_framework import serializers

from .models import Document, FinalReport


class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = [
            "id",
            "internship",
            "document_type",
            "file",
            "status",
            "remarks",
            "uploaded_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "uploaded_at",
        ]


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