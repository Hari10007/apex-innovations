from django.db import models
from employee.models import Employee
# Create your models here.

class Notification(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name = "notifications")
    message = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now=True)