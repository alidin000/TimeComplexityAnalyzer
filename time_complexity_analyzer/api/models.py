from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=100)
    email = models.EmailField()
    # Add any additional user-related fields if needed

class Code(models.Model):
    LANGUAGES = (
        ('Python', 'Python'),
        ('C++', 'C++'),
        ('Java', 'Java'),
    )

    username = models.CharField(max_length=100)
    code = models.TextField()
    language = models.CharField(max_length=100, choices=LANGUAGES)
    time_complexity = models.CharField(max_length=100)
    space_complexity = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code[:50] + "..." if len(self.code) > 50 else self.code


