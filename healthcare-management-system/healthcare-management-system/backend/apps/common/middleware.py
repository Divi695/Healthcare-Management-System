import logging

audit_logger = logging.getLogger("audit")

# Paths where access should be recorded for HIPAA-style audit trails
# (any view touching patient records, prescriptions, or reports).
AUDITED_PREFIXES = ("/api/patients", "/api/prescriptions", "/api/reports")


class AuditLogMiddleware:
    """Logs who accessed which PHI-related endpoint and when."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith(AUDITED_PREFIXES):
            user = getattr(request, "user", None)
            audit_logger.info(
                "user=%s method=%s path=%s status=%s ip=%s",
                getattr(user, "id", "anonymous"),
                request.method,
                request.path,
                response.status_code,
                request.META.get("REMOTE_ADDR"),
            )
        return response
