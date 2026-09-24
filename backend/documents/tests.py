from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import CoordinatorProfile, StudentProfile, User
from documents.models import Document
from internships.models import Internship
from notifications.models import Notification


class DocumentReviewEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.coordinator = User.objects.create_user(
            username="coord2",
            email="coord2@example.com",
            password="secret123",
            role=User.Role.COORDINATOR,
        )
        self.coordinator_profile = CoordinatorProfile.objects.create(
            user=self.coordinator,
            full_name="Coord Two",
            employee_id="coord2",
            mobile_number="9876543210",
            department="Computer Science and Engineering",
            designation="Coordinator",
        )
        self.student_user = User.objects.create_user(
            username="student2",
            email="student2@example.com",
            password="secret123",
        )
        self.student = StudentProfile.objects.create(
            user=self.student_user,
            student_name="Document Student",
            roll_number="ROLL002",
            department="Computer Science and Engineering",
            year=4,
            semester=7,
            mobile_number="1234567891",
        )
        self.internship = Internship.objects.create(
            student=self.student,
            company_name="Doc Company",
            role="Data Intern",
            start_date="2026-01-01",
            end_date="2026-05-01",
            status=Internship.Status.PENDING,
        )
        self.document = Document.objects.create(
            student=self.student,
            internship=self.internship,
            document_type=Document.DocumentType.OFFER_LETTER,
            file=SimpleUploadedFile("offer.pdf", b"pdf-content", content_type="application/pdf"),
            status=Document.Status.PENDING,
            remarks="",
        )

    def test_coordinator_can_approve_document_with_remarks(self):
        self.client.force_authenticate(user=self.coordinator)

        response = self.client.patch(
            f"/api/documents/{self.document.id}/review/",
            {"status": "APPROVED", "remarks": "Offer letter accepted"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.document.refresh_from_db()
        self.assertEqual(self.document.status, Document.Status.APPROVED)
        self.assertEqual(self.document.remarks, "Offer letter accepted")

        notification = Notification.objects.filter(
            recipient=self.student,
            title="Document Approved",
        ).order_by("-created_at").first()
        self.assertIsNotNone(notification)
        self.assertIn("approved", notification.message.lower())

    def test_coordinator_can_reject_document_and_create_notification(self):
        self.client.force_authenticate(user=self.coordinator)

        response = self.client.patch(
            f"/api/documents/{self.document.id}/review/",
            {"status": "REJECTED", "remarks": "Please resubmit"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.document.refresh_from_db()
        self.assertEqual(self.document.status, Document.Status.REJECTED)

        notification = Notification.objects.filter(
            recipient=self.student,
            title="Document Rejected",
        ).order_by("-created_at").first()
        self.assertIsNotNone(notification)
        self.assertIn("rejected", notification.message.lower())

    def test_coordinator_review_list_includes_student_and_file_details(self):
        self.client.force_authenticate(user=self.coordinator)

        response = self.client.get("/api/documents/review/")

        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.data), 0)
        self.assertIn("student_name", response.data[0])
        self.assertEqual(response.data[0]["student_name"], "Document Student")
        self.assertEqual(response.data[0]["roll_number"], "ROLL002")
        self.assertIn("file", response.data[0])
