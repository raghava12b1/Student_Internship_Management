from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from applications.permissions import IsCoordinatorOrAdmin
from .models import Company, Internship
from .serializers import AdminInternshipSerializer, InternshipSerializer
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

