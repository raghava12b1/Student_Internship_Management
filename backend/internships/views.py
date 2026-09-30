from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.permissions import IsCoordinatorOrAdmin
from .models import Company, Internship
from .serializers import AdminInternshipSerializer, InternshipSerializer, ReportInternshipSerializer
from .serializers_company import CompanySerializer


class MyInternshipListCreateView(generics.ListCreateAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Internship.objects.filter(
            student=self.request.user.student_profile
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            student=self.request.user.student_profile
        )

class MyInternshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Internship.objects.filter(
            student=self.request.user.student_profile
        )


class AdminInternshipDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Internship.objects.select_related("student").all()
    serializer_class = AdminInternshipSerializer
    permission_classes = [IsAuthenticated, IsCoordinatorOrAdmin]
class CoordinatorStudentInternshipListView(generics.ListAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated, IsCoordinatorOrAdmin]

    def get_queryset(self):
        student_id = self.kwargs["student_id"]

        return Internship.objects.filter(
            student_id=student_id
        ).order_by("-created_at")

class AdminCompanyListCreateView(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsCoordinatorOrAdmin]

    def get_queryset(self):
        return Company.objects.all().order_by("name")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def list(self, request, *args, **kwargs):
        for company_name in Internship.objects.values_list(
            "company_name", flat=True
        ).distinct():
            if company_name:
                Company.objects.get_or_create(name=company_name)
        companies = self.get_queryset()
        data = []
        for company in companies:
            item = CompanySerializer(company).data
            item["students"] = Internship.objects.filter(
                company_name=company.name
            ).values("student").distinct().count()
            data.append(item)
        return Response(data)


class AdminCompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsCoordinatorOrAdmin]


class InternshipReportListView(generics.ListAPIView):
    serializer_class = ReportInternshipSerializer
    permission_classes = [IsAuthenticated, IsCoordinatorOrAdmin]

    def get_queryset(self):
        queryset = Internship.objects.select_related(
            "student"
        ).all().order_by("-created_at")

        # Company filter
        company = self.request.query_params.get("company")
        if company:
            queryset = queryset.filter(
                company_name__icontains=company
            )

        # Stipend range filters
        stipend_min = self.request.query_params.get("stipend_min")
        if stipend_min:
            queryset = queryset.filter(
                stipend__gte=stipend_min
            )

        stipend_max = self.request.query_params.get("stipend_max")
        if stipend_max:
            queryset = queryset.filter(
                stipend__lte=stipend_max
            )

        # Department filter
        department = self.request.query_params.get("department")
        if department:
            queryset = queryset.filter(
                student__department__icontains=department
            )

        # Status filter
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(
                status=status.upper()
            )

        # Internship type filter
        internship_type = self.request.query_params.get(
            "internship_type"
        )
        if internship_type:
            queryset = queryset.filter(
                internship_type=internship_type.upper()
            )

        return queryset
