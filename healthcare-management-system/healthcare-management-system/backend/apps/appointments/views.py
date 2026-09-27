from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "doctor", "patient", "scheduled_start"]
    ordering_fields = ["scheduled_start"]

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.select_related("patient__user", "doctor")
        if user.role == "patient":
            return qs.filter(patient__user=user)
        if user.role == "doctor":
            return qs.filter(doctor=user)
        return qs
