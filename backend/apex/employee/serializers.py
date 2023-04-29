from rest_framework.serializers import (ModelSerializer,CharField)
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Employee


class EmployeeSerializer(ModelSerializer):
    password2 = CharField(label='Confirm Password', write_only=True)
    class Meta:
        model = Employee
        fields = ['id', 'email', 'password', 'password2']
        
        # Don't sent password
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        confirm_password = validated_data.pop('password2', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            if password == confirm_password:
                instance.set_password(password)
            else:
                raise ValidationError({'password':['Passwords must match']})
        instance.save()
        return instance

class EmployeeDetailSerializer(ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True)
    designation_name = serializers.CharField(source='designation.name', read_only=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = '__all__'
    
    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class EmployeeEmailSerializer(ModelSerializer):

    class Meta:
        model = Employee
        fields = ['email']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
