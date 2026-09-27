from django.conf import settings
from django.db import models
from apps.common.models import BaseModel


class Patient(BaseModel):
    """A patient's demographic + medical profile."""

    class BloodGroup(models.TextChoices):
        A_POS = "A+", "A+"
        A_NEG = "A-", "A-"
        B_POS = "B+", "B+"
        B_NEG = "B-", "B-"
        AB_POS = "AB+", "AB+"
        AB_NEG = "AB-", "AB-"
        O_POS = "O+", "O+"
        O_NEG = "O-", "O-"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="patient_profile"
    )
    blood_group = models.CharField(max_length=3, choices=BloodGroup.choices, blank=True)
    address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    allergies = models.TextField(blank=True, help_text="Comma-separated known allergies")
    chronic_conditions = models.TextField(blank=True)
    primary_doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="assigned_patients", limit_choices_to={"role": "doctor"},
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class MedicalHistoryEntry(BaseModel):
    """A single note in a patient's longitudinal medical history."""

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="history_entries")
    recorded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    diagnosis = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} — {self.diagnosis}"
