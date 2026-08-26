from django.db import models

from accounts.models import StudentProfile


class Application(models.Model):

    class Mode(models.TextChoices):
        ONLINE = "ONLINE", "Online"
        OFFLINE = "OFFLINE", "Offline"
        HYBRID = "HYBRID", "Hybrid"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    company_name = models.CharField(
        max_length=200
    )

    role = models.CharField(
        max_length=200
    )

    location = models.CharField(
        max_length=200
    )

    company_url = models.URLField(
        blank=True
    )

    start_date = models.DateField()

    end_date = models.DateField()

    mode = models.CharField(
        max_length=20,
        choices=Mode.choices
    )

    description = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    remarks = models.TextField(
        blank=True
    )

    applied_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.student.roll_number} - "
            f"{self.company_name} - "
            f"{self.role}"
        )
