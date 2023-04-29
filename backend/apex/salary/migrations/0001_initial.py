# Generated by Django 4.1.7 on 2023-04-27 16:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EmployeeSalary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True, null=True)),
                ('basic_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('over_time_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.BooleanField(default=False)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='employee_salaries', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]