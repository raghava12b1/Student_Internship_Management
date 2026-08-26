from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import StudentProfile
from .serializers import (
    StudentProfileSerializer,
    StudentRegistrationSerializer,
    CustomTokenObtainPairSerializer,
)

from documents.models import Document
from certificates.models import Certificate

from applications.models import Application
from applications.serializers import ApplicationSerializer

from internships.models import Internship

from notifications.models import Notification
from notifications.serializers import NotificationSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class StudentProfileListCreateView(generics.ListCreateAPIView):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer


class StudentRegistrationView(generics.CreateAPIView):
    serializer_class = StudentRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        student_profile = serializer.save()

        return Response(
            {
                "message": "Student registration successful.",
                "student": StudentProfileSerializer(
                    student_profile
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class MyProfileView(generics.RetrieveAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.student_profile


class StudentDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user.student_profile

        applications = Application.objects.filter(
            student=student
        )

        internships = Internship.objects.filter(
            student=student
        )

        notifications = Notification.objects.filter(
            recipient=student
        )

        documents = Document.objects.filter(
            student=student
        )

        offer_letter = documents.filter(
            document_type=Document.DocumentType.OFFER_LETTER
        ).first()

        certificate = Certificate.objects.filter(
            internship__student=student
        ).first()

        # -----------------------------------
        # Pending Reviews
        # -----------------------------------

        pending_reviews = documents.filter(
            status=Document.Status.PENDING
        ).count()

        # -----------------------------------
        # Upcoming Deadlines
        # -----------------------------------

        today = timezone.now().date()

        deadlines = []

        upcoming_internships = internships.filter(
            end_date__gte=today
        ).order_by("end_date")[:3]

        for internship in upcoming_internships:
            deadlines.append(
                {
                    "title": internship.company_name,
                    "description": (
                        f"Internship End Date - "
                        f"{internship.end_date.strftime('%d %b %Y')}"
                    ),
                }
            )

        # -----------------------------------
        # Recent Submissions
        # -----------------------------------

        recent_submissions = []

        for document in documents:

            if document.document_type == Document.DocumentType.FINAL_REPORT:
                document_name = "Final Report"
            else:
                document_name = document.get_document_type_display()

            recent_submissions.append(
                {
                    "document": document_name,
                    "submitted_on": document.uploaded_at.strftime(
                        "%d %b %Y"
                    ),
                    "status": document.status,
                    "verified_by": (
                        "Coordinator"
                        if document.status == Document.Status.APPROVED
                        else "--"
                    ),
                    "date": document.uploaded_at,
                }
            )

        recent_submissions.sort(
            key=lambda item: item["date"],
            reverse=True,
        )

        for submission in recent_submissions:
            submission.pop("date")

        # -----------------------------------
        # Final Report Placeholder
        # -----------------------------------

        final_report_exists = documents.filter(
            document_type=Document.DocumentType.FINAL_REPORT
        ).exists()

        if not final_report_exists:
            recent_submissions.append(
                {
                    "document": "Final Report",
                    "submitted_on": "--",
                    "status": "NOT_SUBMITTED",
                    "verified_by": "--",
                }
            )

        recent_submissions = recent_submissions[:5]

        # -----------------------------------
        # Dashboard Response
        # -----------------------------------

        data = {
            "student": {
                "name": student.user.get_full_name(),
                "username": student.user.username,
                "roll_number": student.roll_number,
            },

            "statistics": {
                "applications": applications.count(),

                "pending_applications": applications.filter(
                    status=Application.Status.PENDING
                ).count(),

                "approved_applications": applications.filter(
                    status=Application.Status.APPROVED
                ).count(),

                "rejected_applications": applications.filter(
                    status=Application.Status.REJECTED
                ).count(),

                "internships": internships.count(),

                "pending_reviews": pending_reviews,

                "notifications": notifications.filter(
                    is_read=False
                ).count(),
            },

            "documents": {
                "offer_letter_count": documents.filter(
                    document_type=Document.DocumentType.OFFER_LETTER
                ).count(),

                "offer_letter_uploaded": offer_letter is not None,

                "offer_letter_status": (
                    offer_letter.status
                    if offer_letter
                    else None
                ),
            },

            "certificate": {
                "uploaded": certificate is not None,

                "verified": (
                    certificate.is_verified
                    if certificate
                    else False
                ),
            },

            "deadlines": deadlines,

            "recent_submissions": recent_submissions,

            "recent_applications": ApplicationSerializer(
                applications.order_by("-applied_at")[:5],
                many=True,
            ).data,

            "recent_notifications": NotificationSerializer(
                notifications.order_by("-created_at")[:5],
                many=True,
            ).data,
        }

        return Response(data)


class CoordinatorDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role not in [
            "COORDINATOR",
            "ADMIN",
        ]:
            return Response(
                {
                    "detail": (
                        "You do not have permission to access "
                        "the coordinator dashboard."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        applications = Application.objects.all()
        internships = Internship.objects.all()

        data = {
            "statistics": {
                "applications": applications.count(),

                "pending_applications": applications.filter(
                    status=Application.Status.PENDING
                ).count(),

                "approved_applications": applications.filter(
                    status=Application.Status.APPROVED
                ).count(),

                "rejected_applications": applications.filter(
                    status=Application.Status.REJECTED
                ).count(),

                "internships": internships.count(),
            },

            "recent_applications": ApplicationSerializer(
                applications.order_by("-applied_at")[:10],
                many=True,
            ).data,
        }

        return Response(data)


class AdminDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "ADMIN":
            return Response(
                {
                    "detail": (
                        "You do not have permission to access "
                        "the admin dashboard."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        students = StudentProfile.objects.all()
        applications = Application.objects.all()
        internships = Internship.objects.all()
        notifications = Notification.objects.all()

        data = {
            "statistics": {
                "students": students.count(),

                "applications": applications.count(),

                "pending_applications": applications.filter(
                    status=Application.Status.PENDING
                ).count(),

                "approved_applications": applications.filter(
                    status=Application.Status.APPROVED
                ).count(),

                "rejected_applications": applications.filter(
                    status=Application.Status.REJECTED
                ).count(),

                "internships": internships.count(),

                "notifications": notifications.count(),
            },

            "recent_applications": ApplicationSerializer(
                applications.order_by("-applied_at")[:10],
                many=True,
            ).data,

            "recent_notifications": NotificationSerializer(
                notifications.order_by("-created_at")[:10],
                many=True,
            ).data,
        }

        return Response(data)