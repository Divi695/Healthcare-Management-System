from rest_framework.routers import DefaultRouter
from .views import PrescriptionViewSet, MedicationViewSet

router = DefaultRouter()
router.register("medications", MedicationViewSet, basename="medication")
router.register("", PrescriptionViewSet, basename="prescription")

urlpatterns = router.urls
