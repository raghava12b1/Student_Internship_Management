from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
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
            "status",
            "remarks",
            "applied_at",
        ]