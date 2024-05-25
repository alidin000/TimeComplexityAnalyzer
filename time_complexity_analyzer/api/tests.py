from django.test import TestCase
from django.urls import reverse
from api.models import Code, UserProfile
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from api.serializers import CodeSerializer, UserSerializer

class APITests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.user_profile = UserProfile.objects.create(user=self.user, username=self.user.username, email=self.user.email)

    def test_create_code(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('codes-list')
        data = {
            'username': self.user.username,
            'code': 'def example():\n    pass',
            'language': 'Python',
            'time_complexity': 'O(1)',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Code.objects.count(), 1)

    def test_retrieve_code(self):
        code = Code.objects.create(
            username=self.user.username,
            code='def example():\n    pass',
            language='Python',
            time_complexity='O(1)',
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('codes-detail', args=[code.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], code.code)

    def test_update_code(self):
        code = Code.objects.create(
            username=self.user.username,
            code='def example():\n    pass',
            language='Python',
            time_complexity='O(1)',
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('codes-detail', args=[code.id])
        data = {
            'username': self.user.username,
            'code': 'def example_updated():\n    pass',
            'language': 'Python',
            'time_complexity': 'O(1)',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        code.refresh_from_db()
        self.assertEqual(code.code, data['code'])

    def test_delete_code(self):
        code = Code.objects.create(
            username=self.user.username,
            code='def example():\n    pass',
            language='Python',
            time_complexity='O(1)',
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('codes-detail', args=[code.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Code.objects.count(), 0)

    def test_analyse_code(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('analyse-code')
        data = {
            'username': self.user.username,
            'code': 'def example():\n    pass',
            'language': 'Python'
        }
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])

    def test_user_registration(self):
        url = reverse('users-list')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_user_login(self):
        url = reverse('login')
        data = {
            'username': self.user.username,
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('successfully logged in', response.data)


class SerializerTests(TestCase):

    def test_code_serializer(self):
        data = {
            'username': 'testuser',
            'code': 'def example():\n    pass',
            'language': 'Python',
            'time_complexity': 'O(1)',
        }
        serializer = CodeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        code = serializer.save()
        self.assertEqual(code.username, data['username'])

    def test_user_serializer(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, data['username'])
        self.assertTrue(user.check_password(data['password']))


class UtilityFunctionTests(TestCase):

    def test_extract_call_template(self):
        from api.views import extract_call_template

        python_code = 'def example(size):\n    pass'
        call_template = extract_call_template(python_code, 'python')
        self.assertEqual(call_template, 'example(generate_input(size))')

        java_code = 'public void example(int size) {\n    }'
        call_template = extract_call_template(java_code, 'java')
        self.assertEqual(call_template, 'p.example(generateInput(size));')

        cpp_code = 'void example(int size) {\n    }'
        call_template = extract_call_template(cpp_code, 'cpp')
        self.assertEqual(call_template, 'p.example($$size$$);')
