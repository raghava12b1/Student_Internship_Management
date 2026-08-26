from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, StudentProfile


class StudentProfileSerializer(serializers.ModelSerializer):
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


class StudentRegistrationSerializer(serializers.Serializer):
    student_name = serializers.CharField(max_length=150)
    roll_number = serializers.CharField(max_length=50)
    department = serializers.CharField(max_length=100)
    year = serializers.IntegerField()
    semester = serializers.IntegerField()
    mobile_number = serializers.CharField(max_length=15)

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({
                "email": "A user with this email already exists."
            })

        if StudentProfile.objects.filter(
            roll_number=data["roll_number"]
        ).exists():
            raise serializers.ValidationError({
                "roll_number": "This roll number already exists."
            })

        return data

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("confirm_password")

        password = validated_data.pop("password")
        email = validated_data.pop("email")

        user = User(
            username=email,
            email=email,
            role=User.Role.STUDENT,
        )
        user.set_password(password)
        user.save()

        student_profile = StudentProfile.objects.create(
            user=user,
            **validated_data
        )

        return student_profile


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["role"] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["username"] = self.user.username
        data["role"] = self.user.role

        return data