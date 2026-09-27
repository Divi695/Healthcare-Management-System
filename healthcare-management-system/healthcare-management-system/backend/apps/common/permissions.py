from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDoctorOrAdmin(BasePermission):
    """Only doctors/admins may create or modify clinical records."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ("doctor", "admin")


class IsOwnerPatientOrStaff(BasePermission):
    """
    A patient may only view their own records; doctors, nurses and
    admins may access any record they're authorized for.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role in ("doctor", "nurse", "admin"):
            return True
        patient = getattr(obj, "patient", obj)
        return getattr(patient, "user_id", None) == user.id
