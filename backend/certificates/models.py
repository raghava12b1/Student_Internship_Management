from django.db import models

from internships.models import Internship


class Certificate(models.Model):

    internship = models.OneToOneField(
        Internship,
        on_delete=models.CASCADE,
        related_name="certificate"
    )

    certificate_number = models.CharField(
        max_length=100,
        unique=True
    )

    issue_date = models.DateField()

    certificate_file = models.FileField(
        upload_to="certificates/"
    )

    is_verified = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.certificate_number
