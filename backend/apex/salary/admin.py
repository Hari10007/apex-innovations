from django.contrib import admin
from .models import EmployeeSalary, EmployeeSalarySlip

# Register your models here.
admin.site.register(EmployeeSalary)
admin.site.register(EmployeeSalarySlip)