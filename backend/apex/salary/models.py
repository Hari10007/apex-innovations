from django.db import models
from django.utils import timezone
from employee.models import Employee

# Create your models here.
class EmployeeSalary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="employee_salaries")
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    over_time_salary = models.DecimalField(max_digits=10, decimal_places=2)
    total_salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=False)
    salary_date = models.DateField(default=timezone.now)

class EmployeeSalarySlip(models.Model):
    employee_salary = models.OneToOneField(EmployeeSalary, on_delete=models.CASCADE, related_name="salary_slip")
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
