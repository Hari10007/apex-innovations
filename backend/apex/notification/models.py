from django.db import models
from employee.models import Employee
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# Create your models here.

class Notification(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name = "notifications")
    message = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now=True)


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        channel_layer = get_channel_layer()
        employee_channel_name = f"employee_{self.employee.id}"
        async_to_sync(channel_layer.group_send)(
            employee_channel_name,
            {
                'type': 'notification_created',
                'notification_id': self.id,
            } 
        )