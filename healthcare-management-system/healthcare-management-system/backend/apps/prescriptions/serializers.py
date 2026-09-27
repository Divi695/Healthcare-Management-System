from rest_framework import serializers
from .models import Prescription, Medication


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ("id", "prescription", "name", "dosage", "frequency",
                  "duration_days", "instructions")
        read_only_fields = ("id",)


class PrescriptionSerializer(serializers.ModelSerializer):
    medications = MedicationSerializer(many=True, required=False)
    patient_name = serializers.CharField(source="patient.user.get_full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.get_full_name", read_only=True)

    class Meta:
        model = Prescription
        fields = ("id", "patient", "patient_name", "doctor", "doctor_name",
                  "appointment", "diagnosis", "is_active", "issued_at", "medications")
        read_only_fields = ("id", "issued_at")

    def create(self, validated_data):
        medications_data = validated_data.pop("medications", [])
        prescription = Prescription.objects.create(**validated_data)
        for med in medications_data:
            Medication.objects.create(prescription=prescription, **med)
        return prescription
