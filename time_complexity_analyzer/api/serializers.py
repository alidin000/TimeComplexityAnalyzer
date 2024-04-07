from rest_framework import serializers
from .models import *

class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ('username', 'code', 'language', 'time_complexity', 'space_complexity')

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