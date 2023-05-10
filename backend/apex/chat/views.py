from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Room, Message
from .serializers import MessageSerializer, EmployeeChatSerializer
from employee.models import Employee
from django.db.models import Q
from rest_framework import status


class MessageList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        employee = request.user
        room_name = request.GET.get('room')

        room = Room.objects.get(name=room_name)

        messages = Message.objects.filter(room=room)

        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data)

class ListEmployees(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        employee = request.user
        keyword = request.GET.get('keyword', '')

        if keyword and keyword.strip() != '':
            employees = Employee.objects.filter(Q(first_name__icontains=keyword)).exclude(id=employee.id)
        else:
            employees = Employee.objects.exclude(id=employee.id)

        # current_user_messages = Message.objects.filter(Q(sender=employee) | Q(receiver=employee)).order_by('-created_at')

        # latest_messages = {}
        # for msg in current_user_messages:
        #     if msg.sender not in latest_messages or msg.created_at > latest_messages[msg.sender]["created_at"]:
        #         latest_messages[msg.sender] = {"created_at": msg.created_at}
        #     if msg.receiver not in latest_messages or msg.created_at > latest_messages[msg.receiver]["created_at"]:
        #         latest_messages[msg.receiver] = {"created_at": msg.created_at}

        # print(latest_messages)
        # Sort the employees by the time of their last chat message
        # sorted_employees = sorted(employees, key=lambda e: -latest_messages.get(e, {"created_at": datetime.datetime.min})["created_at"])

        serializer = EmployeeChatSerializer(employees, many=True)
        result = serializer.data
        return Response(result, status=status.HTTP_200_OK)