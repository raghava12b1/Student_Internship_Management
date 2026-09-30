from django.db import models

from accounts.models import StudentProfile


class Company(models.Model):

    name = models.CharField(max_length=150, unique=True)
    location = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Internship(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        ONGOING = "ONGOING", "Ongoing"
        COMPLETED = "COMPLETED", "Completed"
        REJECTED = "REJECTED", "Rejected"

    class InternshipType(models.TextChoices):
        ONLINE = "ONLINE", "Online"
        OFFLINE = "OFFLINE", "Offline"
        HYBRID = "HYBRID", "Hybrid"

    class StipendType(models.TextChoices):
        STIPEND = "STIPEND", "Stipend"
        NO_STIPEND = "NO_STIPEND", "No Stipend"
        PAID_BY_STUDENT = "PAID_BY_STUDENT", "Paid By Student"

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="internships"
    )

    company_name = models.CharField(
        max_length=150
    )

    role = models.CharField(
        max_length=150
    )

    company_address = models.TextField(
        blank=True
    )

    internship_type = models.CharField(
        max_length=20,
        choices=InternshipType.choices,
        blank=True
    )

    start_date = models.DateField()

    end_date = models.DateField()

    stipend_type = models.CharField(
        max_length=20,
        choices=StipendType.choices,
        default=StipendType.NO_STIPEND,
    )

    stipend = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    hr_name = models.CharField(
        max_length=150,
        blank=True
    )

    hr_email = models.EmailField(
        blank=True
    )

    hr_phone = models.CharField(
        max_length=20,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.company_name} - "
            f"{self.role} - "
            f"{self.student.roll_number}"
        )