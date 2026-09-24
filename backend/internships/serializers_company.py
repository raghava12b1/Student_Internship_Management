from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    students = serializers.IntegerField(read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ["id", "name", "location", "students", "status"]

    def get_status(self, obj):
        return "Active" if obj.is_active else "Inactive"