from django.urls import path
from .views import MessageList, ListEmployees

urlpatterns = [
    path('messages/', MessageList.as_view()),
    path('employees/', ListEmployees.as_view())
]

