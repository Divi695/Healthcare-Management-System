from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from apps.common.permissions import IsDoctorOrAdmin
from .models import Prescription, Medication
from .serializers import PrescriptionSerializer, MedicationSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["patient", "doctor", "is_active"]

    def get_queryset(self):
        user = self.request.user
        qs = Prescription.objects.select_related("patient__user", "doctor").prefetch_related("medications")
        if user.role == "patient":
            return qs.filter(patient__user=user)
        if user.role == "doctor":
            return qs.filter(doctor=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class MedicationViewSet(viewsets.ModelViewSet):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsDoctorOrAdmin]
    filterset_fields = ["prescription"]

    def get_queryset(self):
        return Medication.objects.select_related("prescription")
