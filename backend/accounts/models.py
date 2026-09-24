from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        COORDINATOR = "COORDINATOR", "Coordinator"
        ADMIN = "ADMIN", "Admin"

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )

    def __str__(self):
        return f"{self.username} - {self.role}"


class StudentProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )

    student_name = models.CharField(max_length=150)

    roll_number = models.CharField(
        max_length=50,
        unique=True
    )

    department = models.CharField(max_length=100)

    year = models.PositiveIntegerField()

    semester = models.PositiveIntegerField()

    mobile_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.student_name} - {self.roll_number}"


class CoordinatorProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="coordinator_profile"
    )

    full_name = models.CharField(max_length=150)

    employee_id = models.CharField(
        max_length=50,
        unique=True
    )

    mobile_number = models.CharField(max_length=15)

    department = models.CharField(max_length=100)

    designation = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.full_name} - {self.employee_id}"