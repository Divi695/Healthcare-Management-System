from rest_framework import viewsets, permissions, parsers
from django_filters.rest_framework import DjangoFilterBackend
from apps.common.permissions import IsOwnerPatientOrStaff
from .models import MedicalReport
from .serializers import MedicalReportSerializer


class MedicalReportViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerPatientOrStaff]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["patient", "report_type"]

    def get_queryset(self):
        user = self.request.user
        qs = MedicalReport.objects.select_related("patient__user", "uploaded_by")
        if user.role == "patient":
            return qs.filter(patient__user=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
