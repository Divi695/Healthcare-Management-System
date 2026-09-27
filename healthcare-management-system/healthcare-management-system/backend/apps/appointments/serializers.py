from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.user.get_full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.get_full_name", read_only=True)

    class Meta:
        model = Appointment
        fields = ("id", "patient", "patient_name", "doctor", "doctor_name",
                  "scheduled_start", "scheduled_end", "reason", "status",
                  "notes", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

    def validate(self, attrs):
        instance = Appointment(id=self.instance.id if self.instance else None, **{
            **({f: getattr(self.instance, f) for f in
                ("patient_id", "doctor_id", "scheduled_start", "scheduled_end")} if self.instance else {}),
            **attrs,
        })
        instance.clean()
        return attrs
