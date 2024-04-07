from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from api.models import Code
from api.serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view

@api_view(['POST'])
def analyse_code(request):
    code_data = request.data
    code_serializer = CodeSerializer(data=code_data)
    # print("we are here",code_serializer, code_data)
    if code_serializer.is_valid():
        code_serializer.save()  # Save the code to the database
        print(code_serializer.data, " and saving the code to the database")
        code = code_serializer.data['code']
        language = code_data.get('language')

        # Perform code analysis here
        # You can replace this with your actual code analysis logic

        # For demonstration, let's just echo back the code with a message
        output = f'Code received for {language} analysis: {code}'

        return Response({'output': output})
    else:
        print(code_data)
        print("we are here", code_serializer.errors)
        return Response(code_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
            return Response(f'successfully logged in :{serializer.data}')
        else:
            print("errors: ",request.data)
            return Response("Invalid username ordsad password", status=status.HTTP_401_UNAUTHORIZED)