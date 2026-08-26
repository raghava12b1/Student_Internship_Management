from django.db import models

from accounts.models import StudentProfile
from internships.models import Internship


class Document(models.Model):

    class DocumentType(models.TextChoices):
        OFFER_LETTER = "OFFER_LETTER", "Offer Letter"
        FINAL_REPORT = "FINAL_REPORT", "Final Report"
        CERTIFICATE = "CERTIFICATE", "Certificate"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    student = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    document_type = models.CharField(
        max_length=30,
        choices=DocumentType.choices
    )

    file = models.FileField(
        upload_to="documents/"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    remarks = models.TextField(
        blank=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.student.roll_number} - "
            f"{self.get_document_type_display()}"
        )
        
class FinalReport(models.Model):

    internship = models.ForeignKey(
        Internship,
        on_delete=models.CASCADE,
        related_name="final_reports"
    )

    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name="final_report"
    )

    summary = models.TextField()

    skills = models.TextField()

    submitted_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Final Report - {self.internship.student.roll_number}"