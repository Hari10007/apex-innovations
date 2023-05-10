from django.db import models
from employee.models import Employee
from django.utils import timezone


class Room(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages', default=None)
    sender = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='sent_messages', default=None)
    receiver = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='received_messages', default=None )
    content = models.TextField(db_collation='utf8mb4_unicode_ci')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content}"
    
    