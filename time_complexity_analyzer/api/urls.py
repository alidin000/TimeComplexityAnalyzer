from django.urls import path
from .views import CodeViewSet, home
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('codes', CodeViewSet, basename='codes')
# router.register(r'users', UserViewSet, basename='users')
urlpatterns = router.urls