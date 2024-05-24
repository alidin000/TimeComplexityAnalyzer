import os
import re
from django.shortcuts import render
from rest_framework import viewsets, permissions
from api.models import Code
from api.serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view

from analyzer.analyzer import instrument_java_function, run_java_program, write_and_compile_java
from analyzer.analyzer_python import run_instrumented_python_code
from analyzer.analyzer_cpp import instrument_cpp_function, write_and_compile_cpp, run_cpp_program
from analyzer.graph_fitting import parse_and_analyze

def extract_call_template(user_code, language):
    patterns = {
        'java': r"(?:public\s+)?(?:static\s+)?\w+\s+(\w+)\s*\(",
        'cpp': r"\b\w+\s+\w+\s*\([^)]*\)\s*{",
        'python': r"def\s+(\w+)\s*\(",
    }
    regex = patterns.get(language.lower())
    if not regex:
        raise ValueError("Unsupported language for analysis.")

    match = re.search(regex, user_code)
    if not match:
        raise ValueError("No valid function name found in the provided code.")

    function_name = match.group(1)
    if language.lower() == 'cpp':
        call_template = f"{function_name}(generateInput(size)); // Adjust for C++ specifics if necessary"
    elif language.lower() == 'java':
        call_template = f"p.{function_name}(generateInput(size));"
    else:
        call_template = f"{function_name}(generate_input(size))"

    return call_template

@api_view(['POST'])
def analyse_code(request):
    code_data = request.data
    code_serializer = CodeSerializer(data=code_data)

    print("Incoming data: ", code_serializer.initial_data)

    if code_serializer.is_valid():
        code_serializer.save()
        user_code = code_serializer.validated_data.get('code')  
        language = code_serializer.validated_data.get('language', 'java').lower() 
        call_template = extract_call_template(user_code, language)
        language_map = {
            'java': handle_java_code,
            'cpp': handle_cpp_code,
            'python': handle_python_code
        }

        if language in language_map:
            return language_map[language](user_code, call_template)
        else:
            return Response({"error": f"Language '{language}' not supported for analysis."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(code_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def handle_java_code(user_code, call_template):
    try:
        output_file_path = os.path.join(os.getcwd(),"output_java.txt")
        print (output_file_path)
        java_code = instrument_java_function(user_code, call_template, 50, output_file_path)
        write_and_compile_java(java_code)
        run_java_program()
        best_fits = parse_and_analyze(output_file_path)
        return Response(best_fits)
    except Exception as e:
        print("Running didn't work, or reading output file didn't work:", e.args)
        return Response("shitt")

def handle_cpp_code(user_code, call_template):
    try:
        cpp_code = instrument_cpp_function(user_code, call_template, num_inputs=50)
        write_and_compile_cpp(cpp_code)
        run_cpp_program()
        output_file_path = os.path.join(os.getcwd(), "analyzer", "output_cpp.txt")
        best_fits = parse_and_analyze(output_file_path)
        return Response(best_fits)
    except Exception as e:
        print("Running didn't work, or reading output file didn't work:", e.args)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def handle_python_code(user_code, call_template):
    try:
        output_file_path = os.path.join(os.getcwd(), "analyzer", "output_python.txt")
        
        if os.path.exists(output_file_path):
            os.remove(output_file_path)
        run_instrumented_python_code(user_code, number_of_inputs=50)
        print(output_file_path)
        if os.path.exists(output_file_path):
            best_fits = parse_and_analyze(output_file_path)
            return Response(best_fits)
        else:
            return Response({"error": "Output file does not exist. Analysis may have failed."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("Running didn't work, or reading output file didn't work:", e.args)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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