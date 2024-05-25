from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password

class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ('username', 'code', 'language', 'time_complexity')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        # extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)

        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")

        return data
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)