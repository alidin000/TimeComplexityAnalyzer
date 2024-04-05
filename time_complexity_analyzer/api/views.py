from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from api.models import Code
from api.serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
# Create your views here.
def home(request):
    return HttpResponse("This is the home page of the time complexity analyzer app.")


class CodeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    def list(self, request):
        query_set = self.queryset
        serializer = self.serializer_class(query_set, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        code = self.queryset.get(id=pk)
        serializer = self.serializer_class(code)
        return Response(serializer.data)

    def update(self, request, pk=None):
        code = self.queryset.get(id=pk)
        serializer = self.serializer_class(code, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        code = self.queryset.get(id=pk)
        code.delete()
        return Response({"message": "Code snippet deleted successfully."},status=204)

class UserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def list(self, request):
        query_set = self.queryset
        serializer = self.serializer_class(query_set, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        user = self.queryset.get(id=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        user = self.queryset.get(id=pk)
        serializer = self.serializer_class(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def destroy(self, request, pk=None):
        user = self.queryset.get(id=pk)
        user.delete()
        return Response({"message": "User deleted successfully."},status=204)
    
    def login(self, request):
        username = request.data.get('username', None)
        password = request.data.get('password', None)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            serializer = self.serializer_class(user)
            return Response(serializer.data)
        else:
            return Response("Invalid username or password", status=status.HTTP_401_UNAUTHORIZED)