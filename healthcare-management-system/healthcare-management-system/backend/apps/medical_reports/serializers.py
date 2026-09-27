from rest_framework import serializers
from .models import MedicalReport


class MedicalReportSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.get_full_name", read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MedicalReport
        fields = ("id", "patient", "uploaded_by", "uploaded_by_name", "report_type",
                  "title", "file", "file_url", "notes", "created_at")
        read_only_fields = ("id", "uploaded_by", "created_at")
        extra_kwargs = {"file": {"write_only": True}}

    def get_file_url(self, obj):
        """
        Returns a short-lived signed URL (S3) so files are never publicly
        accessible without going through this API + a live auth check.
        """
        if not obj.file:
            return None
        return obj.file.url
