from rest_framework import serializers
from .models import *

class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ('user', 'code', 'language', 'time_complexity', 'space_complexity')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        # extra_kwargs = {'password': {'write_only': True}}