import os
import uuid
from django.conf import settings
from django.db import models
from apps.common.models import BaseModel
from apps.patients.models import Patient


def report_upload_path(instance, filename):
    """Namespaced, non-guessable path: reports/<patient_id>/<uuid>.<ext>"""
    ext = os.path.splitext(filename)[1]
    return f"reports/{instance.patient_id}/{uuid.uuid4()}{ext}"


class MedicalReport(BaseModel):
    class ReportType(models.TextChoices):
        LAB_RESULT = "lab_result", "Lab Result"
        IMAGING = "imaging", "Imaging (X-ray/MRI/CT)"
        DISCHARGE_SUMMARY = "discharge_summary", "Discharge Summary"
        OTHER = "other", "Other"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_reports")
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    report_type = models.CharField(max_length=30, choices=ReportType.choices, default=ReportType.OTHER)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=report_upload_path)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.title} — {self.patient}"
