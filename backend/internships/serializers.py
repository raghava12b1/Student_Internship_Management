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
            "stipend_type",
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

    def validate(self, attrs):
        """Keep stipend amount consistent with the selected stipend type."""
        instance = getattr(self, "instance", None)
        stipend_type = attrs.get(
            "stipend_type",
            getattr(instance, "stipend_type", Internship.StipendType.NO_STIPEND),
        )
        stipend = attrs.get("stipend", getattr(instance, "stipend", None))

        # Backward compatibility for older clients that submit only an amount.
        if (
            "stipend_type" not in self.initial_data
            and stipend is not None
            and stipend > 0
        ):
            stipend_type = Internship.StipendType.STIPEND
            attrs["stipend_type"] = stipend_type

        if stipend_type == Internship.StipendType.STIPEND:
            if stipend is None or stipend <= 0:
                raise serializers.ValidationError({
                    "stipend": "Enter a stipend amount greater than zero."
                })
        else:
            attrs["stipend"] = None

        return attrs


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
            "stipend_type",
            "stipend",
            "status",
            "created_at",
        ]