# Generated by Django 5.0.2 on 2024-03-30 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_code_language'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='language',
            field=models.CharField(choices=[('Python', 'Python'), ('C++', 'C++'), ('Java', 'Java')], max_length=100),
        ),
    ]
