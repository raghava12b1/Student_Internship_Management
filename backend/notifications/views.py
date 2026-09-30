from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Notification
from .serializers import NotificationSerializer


class MyNotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == "ADMIN":
            return Notification.objects.all().order_by("-created_at")
        elif self.request.user.role == "COORDINATOR":
            if hasattr(self.request.user, "coordinator_profile"):
                dept = self.request.user.coordinator_profile.department
                return Notification.objects.filter(
                    recipient__department__iexact=dept
                ).order_by("-created_at")
            return Notification.objects.none()
            
        return Notification.objects.filter(
            recipient=self.request.user.student_profile
        ).order_by("-created_at")
        
class MarkNotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["patch"]

    def get_queryset(self):
        if self.request.user.role in ["COORDINATOR", "ADMIN"]:
            return Notification.objects.all()
        return Notification.objects.filter(
            recipient=self.request.user.student_profile
        )

    def perform_update(self, serializer):
        serializer.save(is_read=True)