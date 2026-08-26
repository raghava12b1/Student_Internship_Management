from rest_framework.permissions import BasePermission


class IsCoordinatorOrAdmin(BasePermission):
    message = "Only coordinators and admins can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in [
                "COORDINATOR",
                "ADMIN",
            ]
        )