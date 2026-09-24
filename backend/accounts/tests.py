from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase


class CoordinatorRegistrationAPITest(APITestCase):

    def test_coordinator_registration_returns_profile_data(self):
        client = APIClient()
        payload = {
            "full_name": "Jane Coordinator",
            "employee_id": "CSE-101",
            "college_email": "jane.coordinator@college.edu",
            "mobile_number": "9876543210",
            "department": "Computer Science and Engineering",
            "designation": "Head of Department",
            "password": "StrongPass123",
            "confirm_password": "StrongPass123",
        }

        response = client.post(
            reverse("coordinator-register"),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Coordinator registration successful.")
        self.assertEqual(response.data["coordinator"]["employee_id"], "CSE-101")
        self.assertEqual(response.data["coordinator"]["college_email"], "jane.coordinator@college.edu")
        self.assertEqual(response.data["coordinator"]["department"], "Computer Science and Engineering")
