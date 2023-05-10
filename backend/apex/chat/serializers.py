from rest_framework.serializers import (ModelSerializer,CharField)
from rest_framework import serializers
from .models import Message
from employee.models import Employee



class EmployeeChatSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['id', 'email', 'image', 'name']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class MessageSerializer(serializers.ModelSerializer):
    sender = EmployeeChatSerializer(read_only=True)
    receiver = EmployeeChatSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['room', 'sender', 'receiver', 'content', 'created_at']