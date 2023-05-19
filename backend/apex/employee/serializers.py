from rest_framework.serializers import (ModelSerializer,CharField)
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Employee, Designation
from datetime import datetime, timedelta
from django.utils import timezone
from salary.models import EmployeeSalary
from attendance.models import Attendance


class EmployeeUpdateSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'image', 'name', 'email', 'first_name', 'last_name', 'phone', 'designation',
                  'qualification', 'date_joined', 'parent', 'city', 'state', 'salary', 'is_admin', 'is_manager',
                  'is_active', 'is_superuser', 'is_staff']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class EmployeeSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(label='Confirm Password', write_only=True)
    designation_id = serializers.PrimaryKeyRelatedField(
        queryset=Designation.objects.all(),
        source='designation',
        write_only=True,
        allow_null=True
    )
    manager_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source='parent',
        write_only=True,
        allow_null=True
    )

    class Meta:
        model = Employee
        fields = ['id', 'image', 'email', 'password', 'password2', 'first_name', 'last_name', 'phone', 'designation_id',
                  'qualification', 'date_joined', 'manager_id', 'city', 'state', 'salary', 'is_admin', 'is_manager',
                  'is_active', 'is_superuser', 'is_staff', 'is_hr_manager']

        extra_kwargs = {
            'password': {'write_only': True},
        }


    def create(self, validated_data):
        password = validated_data.pop('password', None)
        confirm_password = validated_data.pop('password2', None)

        instance = self.Meta.model(**validated_data)

        if password is not None:
            if password == confirm_password:
                instance.set_password(password)
            else:
                raise serializers.ValidationError("Passwords must match")
        instance.save()
        return instance

class EmployeeDetailSerializer(ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True)
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    manager = serializers.CharField(source='parent.name', read_only=True)
    name = serializers.SerializerMethodField()
    salary_status = serializers.SerializerMethodField()
    attendance_pending = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = '__all__'
    
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def get_salary_status(self, obj):
        previous_month = timezone.now().replace(day=1) - timedelta(days=1)
        try:
            employee_salary = obj.employee_salaries.get(salary_date__year=previous_month.year, salary_date__month=previous_month.month)
            if employee_salary.status:
                return "Paid"
            else:
                return "Not Paid"
        except EmployeeSalary.DoesNotExist:
            return "Not Paid"
    
    def get_attendance_pending(self, obj):
        count = Attendance.objects.filter(employee=obj, status='pending').count()
        return count


class EmployeeEmailSerializer(ModelSerializer):

    class Meta:
        model = Employee
        fields = ['email']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)


class DesignationSerializer(ModelSerializer):

    class Meta:
        model = Designation
        fields = '__all__'