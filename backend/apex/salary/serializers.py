from rest_framework.serializers import (ModelSerializer,CharField)
from rest_framework import serializers
from .models import EmployeeSalary

class EmployeeSalarySerializer(ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    salary_slip = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeSalary
        fields = '__all__'

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    def get_salary_slip(self, obj):
        return hasattr(obj, 'salary_slip') and obj.salary_slip is not None