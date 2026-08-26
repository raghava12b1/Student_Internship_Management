from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Internship
from .serializers import InternshipSerializer


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

