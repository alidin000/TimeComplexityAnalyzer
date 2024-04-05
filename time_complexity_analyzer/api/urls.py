from django.urls import path
from .views import CodeViewSet, UserViewSet, analyse_code
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('codes', CodeViewSet, basename='codes')
router.register('users', UserViewSet, basename='users')
urlpatterns = router.urls + [
    path('login/', UserViewSet.as_view({'post': 'login'}), name='login'),
    path('api/analyse-code/', analyse_code, name='analyse-code'),
]