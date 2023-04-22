from django.shortcuts import render
from notification.models import Notification
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import NotificationSerializer
# Create your views here.

class ListNotification(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        employee = request.user
   
        notifications = employee.notifications.all().order_by('-date_created')
        count = employee.notifications.filter(status=True).count()
        serializer = NotificationSerializer(notifications, many=True)
        data = {
            "count": count,
            "notifications": serializer.data
        }

        return Response(data)

class ResetNotification(APIView):
    permission_classes = (IsAuthenticated,)

    def post(Self, request):
        employee = request.user

        employee.notifications.all().update(status=False)
        count = employee.notifications.filter(status=True).count()
        return Response(count)