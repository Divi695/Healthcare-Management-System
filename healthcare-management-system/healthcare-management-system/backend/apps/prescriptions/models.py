from django.conf import settings
from django.db import models
from apps.common.models import BaseModel
from apps.patients.models import Patient
from apps.appointments.models import Appointment


class Prescription(BaseModel):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="prescriptions")
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="issued_prescriptions", limit_choices_to={"role": "doctor"},
    )
    appointment = models.ForeignKey(
        Appointment, on_delete=models.SET_NULL, null=True, blank=True, related_name="prescriptions"
    )
    diagnosis = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rx for {self.patient} — {self.diagnosis}"


class Medication(BaseModel):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name="medications")
    name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100, help_text="e.g. 500mg")
    frequency = models.CharField(max_length=100, help_text="e.g. Twice daily")
    duration_days = models.PositiveIntegerField()
    instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.dosage})"
