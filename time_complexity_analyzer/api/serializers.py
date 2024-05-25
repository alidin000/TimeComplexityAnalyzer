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

    def validate(self, data):
        if 'username' not in data or not data['username']:
            raise serializers.ValidationError({'username': 'Username is required.'})
        if 'email' not in data or not data['email']:
            raise serializers.ValidationError({'email': 'Email is required.'})
        if 'password' not in data or not data['password']:
            raise serializers.ValidationError({'password': 'Password is required.'})

        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)