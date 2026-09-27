from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, MedicalHistoryViewSet

router = DefaultRouter()
router.register("history", MedicalHistoryViewSet, basename="medical-history")
router.register("", PatientViewSet, basename="patient")

urlpatterns = router.urls
