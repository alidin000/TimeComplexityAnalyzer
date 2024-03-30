from rest_framework import serializers
from .models import *

class CodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Code
        fields = ('user', 'code', 'language', 'time_complexity', 'space_complexity')