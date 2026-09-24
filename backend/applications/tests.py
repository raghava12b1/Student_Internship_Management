from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import StudentProfile, User
from applications.models import Application


class ApplicationReviewEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.coordinator = User.objects.create_user(
            username="coord1",
            email="coord1@example.com",
            password="secret123",
            role=User.Role.COORDINATOR,
        )
        self.student_user = User.objects.create_user(
            username="student1",
            email="student1@example.com",
            password="secret123",
        )
        self.student = StudentProfile.objects.create(
            user=self.student_user,
            student_name="Test Student",
            roll_number="ROLL001",
            department="CSE",
            year=4,
            semester=7,
            mobile_number="1234567890",
        )
        self.application = Application.objects.create(
            student=self.student,
            company_name="Example Corp",
            role="Software Intern",
            location="Hyderabad",
            company_url="https://example.com",
            start_date="2026-01-01",
            end_date="2026-05-01",
            mode=Application.Mode.ONLINE,
            description="Test",
            status=Application.Status.PENDING,
            remarks="",
        )

    def test_coordinator_can_approve_application_with_remarks(self):
        self.client.force_authenticate(user=self.coordinator)

        response = self.client.patch(
            f"/api/applications/{self.application.id}/review/",
            {"status": "APPROVED", "remarks": "Approved by coordinator"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, Application.Status.APPROVED)
        self.assertEqual(self.application.remarks, "Approved by coordinator")
