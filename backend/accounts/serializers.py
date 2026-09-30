from django.db import transaction

from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    User,
    StudentProfile,
    CoordinatorProfile,
)


# ============================================================
# STUDENT PROFILE SERIALIZER
# ============================================================

class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()

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
            "email",
        ]

    def get_email(self, obj):
        return obj.user.email


# ============================================================
# STUDENT REGISTRATION SERIALIZER
# ============================================================

class StudentRegistrationSerializer(serializers.Serializer):

    student_name = serializers.CharField(max_length=150)
    roll_number = serializers.CharField(max_length=50)
    department = serializers.CharField(max_length=100)
    year = serializers.IntegerField()
    semester = serializers.IntegerField()
    mobile_number = serializers.CharField(max_length=15)

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate(self, data):

        # ------------------------------------------------------
        # PASSWORD MATCH
        # ------------------------------------------------------

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        # ------------------------------------------------------
        # EMAIL UNIQUE
        # ------------------------------------------------------

        if User.objects.filter(
            email=data["email"]
        ).exists():

            raise serializers.ValidationError({
                "email": "A user with this email already exists."
            })

        # ------------------------------------------------------
        # ROLL NUMBER UNIQUE
        # ------------------------------------------------------

        if StudentProfile.objects.filter(
            roll_number=data["roll_number"]
        ).exists():

            raise serializers.ValidationError({
                "roll_number": "This roll number already exists."
            })

        # ------------------------------------------------------
        # ROLL NUMBER AS USERNAME UNIQUE
        # ------------------------------------------------------

        if User.objects.filter(
            username=data["roll_number"]
        ).exists():

            raise serializers.ValidationError({
                "roll_number": "This roll number is already registered."
            })

        return data

    @transaction.atomic
    def create(self, validated_data):

        # ------------------------------------------------------
        # REMOVE CONFIRM PASSWORD
        # ------------------------------------------------------

        validated_data.pop("confirm_password")

        # ------------------------------------------------------
        # GET PASSWORD AND EMAIL
        # ------------------------------------------------------

        password = validated_data.pop("password")
        email = validated_data.pop("email")

        # ------------------------------------------------------
        # CREATE USER
        #
        # USERNAME = ROLL NUMBER
        # ------------------------------------------------------

        user = User(
            username=validated_data["roll_number"],
            email=email,
            role=User.Role.STUDENT,
        )

        user.set_password(password)
        user.save()

        # ------------------------------------------------------
        # CREATE STUDENT PROFILE
        # ------------------------------------------------------

        student_profile = StudentProfile.objects.create(
            user=user,
            **validated_data
        )

        return student_profile


# ============================================================
# COORDINATOR PROFILE SERIALIZER
# ============================================================

class CoordinatorProfileSerializer(serializers.ModelSerializer):
    college_email = serializers.SerializerMethodField()

    class Meta:
        model = CoordinatorProfile

        fields = [
            "id",
            "full_name",
            "employee_id",
            "college_email",
            "mobile_number",
            "department",
            "designation",
        ]

    def get_college_email(self, obj):
        return obj.user.email


# ============================================================
# COORDINATOR REGISTRATION SERIALIZER
# ============================================================

class CoordinatorRegistrationSerializer(serializers.Serializer):

    full_name = serializers.CharField(max_length=150)

    employee_id = serializers.CharField(max_length=50)

    college_email = serializers.EmailField()

    mobile_number = serializers.CharField(max_length=15)

    department = serializers.CharField(max_length=100)

    designation = serializers.CharField(max_length=100)

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate(self, data):

        # ------------------------------------------------------
        # PASSWORD MATCH
        # ------------------------------------------------------

        if data["password"] != data["confirm_password"]:

            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        # ------------------------------------------------------
        # MOBILE VALIDATION
        # ------------------------------------------------------

        if (
            not data["mobile_number"].isdigit()
            or len(data["mobile_number"]) != 10
        ):

            raise serializers.ValidationError({
                "mobile_number":
                    "Please enter a valid 10-digit mobile number."
            })

        # ------------------------------------------------------
        # EMPLOYEE ID UNIQUE
        #
        # EMPLOYEE ID = USERNAME
        # ------------------------------------------------------

        if User.objects.filter(
            username=data["employee_id"]
        ).exists():

            raise serializers.ValidationError({
                "employee_id":
                    "This employee ID is already registered."
            })

        # ------------------------------------------------------
        # EMPLOYEE ID UNIQUE IN COORDINATOR PROFILE
        # ------------------------------------------------------

        if CoordinatorProfile.objects.filter(
            employee_id=data["employee_id"]
        ).exists():

            raise serializers.ValidationError({
                "employee_id":
                    "This employee ID is already registered."
            })

        # ------------------------------------------------------
        # EMAIL UNIQUE
        # ------------------------------------------------------

        if User.objects.filter(
            email=data["college_email"]
        ).exists():

            raise serializers.ValidationError({
                "college_email":
                    "A user with this email already exists."
            })

        return data

    @transaction.atomic
    def create(self, validated_data):

        # ------------------------------------------------------
        # REMOVE CONFIRM PASSWORD
        # ------------------------------------------------------

        validated_data.pop("confirm_password")

        # ------------------------------------------------------
        # GET PASSWORD
        # ------------------------------------------------------

        password = validated_data.pop("password")

        # ------------------------------------------------------
        # GET LOGIN INFORMATION
        # ------------------------------------------------------

        employee_id = validated_data.pop("employee_id")

        college_email = validated_data.pop("college_email")

        # ------------------------------------------------------
        # CREATE USER
        #
        # USERNAME = EMPLOYEE ID
        # EMAIL = COLLEGE EMAIL
        # ROLE = COORDINATOR
        # ------------------------------------------------------

        user = User(
            username=employee_id,
            email=college_email,
            role=User.Role.COORDINATOR,
        )

        user.set_password(password)
        user.save()

        # ------------------------------------------------------
        # CREATE COORDINATOR PROFILE
        #
        # college_email is NOT passed here because email
        # belongs to the User model.
        # ------------------------------------------------------

        coordinator_profile = CoordinatorProfile.objects.create(
            user=user,
            employee_id=employee_id,
            **validated_data
        )

        return coordinator_profile


# ============================================================
# JWT LOGIN SERIALIZER
# ============================================================

class CustomTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

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