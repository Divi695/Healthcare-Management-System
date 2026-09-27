from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from apps.common.models import BaseModel
from apps.patients.models import Patient


class Appointment(BaseModel):
    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        NO_SHOW = "no_show", "No Show"

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="doctor_appointments", limit_choices_to={"role": "doctor"},
    )
    scheduled_start = models.DateTimeField()
    scheduled_end = models.DateTimeField()
    reason = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["scheduled_start"]
        indexes = [models.Index(fields=["doctor", "scheduled_start"])]

    def clean(self):
        if self.scheduled_end <= self.scheduled_start:
            raise ValidationError("scheduled_end must be after scheduled_start.")
        conflict = Appointment.objects.filter(
            doctor=self.doctor,
            status__in=[self.Status.SCHEDULED, self.Status.CONFIRMED],
            scheduled_start__lt=self.scheduled_end,
            scheduled_end__gt=self.scheduled_start,
        ).exclude(pk=self.pk)
        if conflict.exists():
            raise ValidationError("This doctor already has an appointment in that time slot.")

    def __str__(self):
        return f"{self.patient} with Dr. {self.doctor.get_full_name()} @ {self.scheduled_start}"
