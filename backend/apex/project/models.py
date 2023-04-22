from django.db import models
from employee.models import Employee

# Create your models here.

class Project(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    )

    image = models.ImageField(upload_to='projects/', blank=True)
    title = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='projects')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='active')
    employees = models.ManyToManyField(Employee, through='EmployeeProject', related_name='project_participants')
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    date_modified = models.DateTimeField(auto_now=True, null=True, blank=True)


class EmployeeProject(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employee_projects')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='employee_projects')
    date_assigned = models.DateTimeField(auto_now_add=True, null=True, blank=True)
