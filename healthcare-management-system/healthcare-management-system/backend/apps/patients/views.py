from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from apps.common.permissions import IsOwnerPatientOrStaff
from .models import Patient, MedicalHistoryEntry
from .serializers import PatientSerializer, MedicalHistoryEntrySerializer


class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerPatientOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["blood_group", "primary_doctor"]
    search_fields = ["user__first_name", "user__last_name", "user__email"]

    def get_queryset(self):
        user = self.request.user
        qs = Patient.objects.select_related("user", "primary_doctor")
        if user.role == "patient":
            return qs.filter(user=user)
        if user.role == "doctor":
            return qs.filter(primary_doctor=user)
        return qs  # admin/nurse see all


class MedicalHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalHistoryEntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerPatientOrStaff]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["patient"]

    def get_queryset(self):
        user = self.request.user
        qs = MedicalHistoryEntry.objects.select_related("patient", "recorded_by")
        if user.role == "patient":
            return qs.filter(patient__user=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)
