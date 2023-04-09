from rest_framework import serializers
from .models import EmployeeLeave, Leave

class EmployeeLeaveSerializer(serializers.ModelSerializer):
    leave_name = serializers.CharField(source='leave.name')
    employee_name = serializers.SerializerMethodField()
    first_name = serializers.CharField(source='employee.first_name')
    last_name = serializers.CharField(source='employee.last_name')
    designation =serializers.CharField(source='employee.designation.name')
    
    class Meta:
        model = EmployeeLeave()
        fields = '__all__'
    
    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'