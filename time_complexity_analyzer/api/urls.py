from django.urls import path
from .views import CodeViewSet, UserViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('codes', CodeViewSet, basename='codes')
router.register('users', UserViewSet, basename='users')
urlpatterns = router.urls