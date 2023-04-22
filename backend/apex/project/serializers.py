from rest_framework.serializers import (ModelSerializer)
from rest_framework import serializers
from .models import Project


class ProjectSerializer(ModelSerializer):
    employee_names = serializers.SerializerMethodField()
    employee_emails = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_employee_names(self, obj):
        if obj.employee_projects.exists():
            employee_projects = obj.employee_projects.all()
            employee_names = []
            for employee_project in employee_projects:
                employee_names.append(f"{employee_project.employee.first_name} {employee_project.employee.last_name}")
            return employee_names
        return None 
    
    def get_employee_emails(self, obj):
        if obj.employee_projects.exists():
            employee_projects = obj.employee_projects.all()
            employee_emails = []
            for employee_project in employee_projects:
                employee_emails.append(employee_project.employee.email)
            return employee_emails
        return None 