# Generated by Django 4.1.7 on 2023-04-27 16:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('salary', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='employeesalary',
            name='salary_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
