import re

from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import StudentProfile, CoordinatorProfile
from .serializers import (
    StudentProfileSerializer,
    StudentRegistrationSerializer,
    CoordinatorRegistrationSerializer,
    CoordinatorProfileSerializer,
    CustomTokenObtainPairSerializer,
)

from documents.models import Document
from certificates.models import Certificate

from applications.models import Application
from applications.serializers import ApplicationSerializer

from internships.models import Internship

from notifications.models import Notification
from notifications.serializers import NotificationSerializer


def normalize_department_value(value):
    if value is None:
        return ""
    normalized = value.strip().lower()
    normalized = normalized.replace("&", "and")
    normalized = re.sub(r"[^a-z0-9]+", "", normalized)
    aliases = {
        "cse": "cse",
        "computerscienceengineering": "cse",
        "computerscienceandengineering": "cse",
        "computer science engineering": "cse",
        "computer science and engineering": "cse",
        "electronicsandcommunicationengineering": "ece",
        "informationtechnology": "it",
        "it": "it",
        "mechanicalengineering": "mech",
        "civilengineering": "civil",
    }
    return aliases.get(normalized, normalized)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class StudentProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = StudentProfile.objects.select_related("user").all()

        if self.request.user.role == "COORDINATOR":
            if not hasattr(self.request.user, "coordinator_profile"):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Coordinator profile not found.")
            department = normalize_department_value(self.request.user.coordinator_profile.department)
            return [
                student for student in queryset
                if normalize_department_value(getattr(student, "department", "")) == department
            ]

        return queryset


class AdminStudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.user.role == "COORDINATOR":
            if not hasattr(request.user, "coordinator_profile"):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Coordinator profile not found.")
            if normalize_department_value(obj.department) != normalize_department_value(request.user.coordinator_profile.department):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("You can only view students from your department.")
        elif request.user.role != "ADMIN":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can manage students.")


class AdminCoordinatorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CoordinatorProfile.objects.all()
    serializer_class = CoordinatorProfileSerializer
    permission_classes = [IsAuthenticated]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.user.role != "ADMIN":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can manage coordinators.")


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

# ============================================================
# COORDINATOR REGISTRATION
# ============================================================

class CoordinatorRegistrationView(generics.CreateAPIView):
    serializer_class = CoordinatorRegistrationSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        coordinator_profile = serializer.save()

        return Response(
            {
                "message": "Coordinator registration successful.",
                "coordinator": CoordinatorProfileSerializer(
                    coordinator_profile
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )

class MyProfileView(generics.RetrieveAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Check if user has student profile
        if not hasattr(self.request.user, 'student_profile'):
            raise NotFound(
                "Student profile not found. Only students have profiles."
            )
        return self.request.user.student_profile


class StudentDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Check if user has student profile
        if not hasattr(request.user, 'student_profile'):
            raise NotFound(
                "Student profile not found. Only students can access dashboard."
            )
        
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
        # Current Internship
        # -----------------------------------

        current_internship = (
            internships
            .filter(
                status=Internship.Status.ONGOING
            )
            .order_by("-start_date")
            .first()
        )

        # If there is no ongoing internship,
        # use the most recently created internship.
        if current_internship is None:
            current_internship = (
                internships
                .order_by("-created_at")
                .first()
            )

        internship_data = None

        if current_internship:

            today = timezone.now().date()

            start_date = current_internship.start_date
            end_date = current_internship.end_date

            # -----------------------------------
            # Calculate Internship Progress
            # -----------------------------------

            if current_internship.status == Internship.Status.COMPLETED:
                progress = 100

            elif current_internship.status == Internship.Status.REJECTED:
                progress = 0

            elif today <= start_date:
                progress = 0

            elif today >= end_date:
                progress = 100

            else:
                total_days = (
                    end_date - start_date
                ).days

                elapsed_days = (
                    today - start_date
                ).days

                if total_days > 0:
                    progress = round(
                        (
                            elapsed_days /
                            total_days
                        ) * 100
                    )
                else:
                    progress = 0

            # Keep progress between 0 and 100.
            progress = max(
                0,
                min(100, progress)
            )

            internship_data = {
                "id":
                    current_internship.id,

                "company_name":
                    current_internship.company_name,

                "role":
                    current_internship.role,

                "status":
                    current_internship.status,

                "status_display":
                    current_internship.get_status_display(),

                "internship_type":
                    current_internship.internship_type,

                "start_date":
                    current_internship.start_date,

                "end_date":
                    current_internship.end_date,

                "progress":
                    progress,
            }

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

            "internship": internship_data,

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
        coordinators = CoordinatorProfile.objects.select_related("user")
        documents = Document.objects.select_related("student", "internship")

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

            "students": StudentProfileSerializer(
                students,
                many=True,
            ).data,

            "coordinators": [
                {
                    "id": coordinator.id,
                    "name": coordinator.full_name,
                    "employee_id": coordinator.employee_id,
                    "department": coordinator.department,
                    "email": coordinator.user.email,
                    "students": 0,
                    "status": "Active" if coordinator.user.is_active else "Inactive",
                }
                for coordinator in coordinators
            ],

            "internships": [
                {
                    "id": internship.id,
                    "student": internship.student.student_name,
                    "roll_number": internship.student.roll_number,
                    "company": internship.company_name,
                    "role": internship.role,
                    "duration": f"{internship.start_date} - {internship.end_date}",
                    "status": internship.get_status_display(),
                }
                for internship in internships.order_by("-created_at")
            ],

            "companies": [
                {
                    "name": company,
                    "students": internships.filter(company_name=company).values("student").distinct().count(),
                    "status": "Active",
                }
                for company in internships.values_list("company_name", flat=True).distinct()
            ],

            "reports": [
                {
                    "id": document.id,
                    "report": document.get_document_type_display(),
                    "student": document.student.student_name,
                    "date": document.uploaded_at,
                    "status": document.get_status_display(),
                    "file": document.file.url if document.file else None,
                }
                for document in documents.order_by("-uploaded_at")
            ],
        }

        return Response(data)