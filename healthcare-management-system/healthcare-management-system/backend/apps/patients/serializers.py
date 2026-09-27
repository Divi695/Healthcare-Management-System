from rest_framework import serializers
from .models import Patient, MedicalHistoryEntry


class MedicalHistoryEntrySerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.CharField(source="recorded_by.get_full_name", read_only=True)

    class Meta:
        model = MedicalHistoryEntry
        fields = ("id", "patient", "recorded_by", "recorded_by_name",
                  "diagnosis", "notes", "recorded_at")
        read_only_fields = ("id", "recorded_at", "recorded_by")


class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    history_entries = MedicalHistoryEntrySerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = ("id", "user", "full_name", "blood_group", "address",
                  "emergency_contact_name", "emergency_contact_phone",
                  "allergies", "chronic_conditions", "primary_doctor",
                  "history_entries", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")
