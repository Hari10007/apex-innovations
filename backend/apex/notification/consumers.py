from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from .models import Notification

class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        employee_id = self.scope['url_route']['kwargs']['employee_id']
        self.group_name = f"employee_{employee_id}"
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def notification_created(self, event):
        notification = await sync_to_async(Notification.objects.get)(id=event['notification_id'])
        message = notification.message
        date_created = notification.date_created.strftime('%b %d, %Y')
        data = {
            'message': message,
            'date_created': date_created,
        }
        await self.send(text_data=json.dumps(data))