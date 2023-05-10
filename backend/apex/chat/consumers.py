import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room, Message
from employee.models import Employee
from .serializers import MessageSerializer
from django.core.exceptions import ObjectDoesNotExist


class ChatConsumer(AsyncWebsocketConsumer):
    room_group_name = None
    room_name = None
    
    async def connect(self):
        room_name = self.scope['url_route']['kwargs']['room_id']
        employee_ids = room_name.split('_')[1:]

        employee1_id = int(employee_ids[0])
        employee2_id = int(employee_ids[1])

        room_name = f"chat_{min(employee1_id, employee2_id)}_{max(employee1_id, employee2_id)}"

        exists = await sync_to_async(Room.objects.filter(name=room_name).exists)()

        if exists:
            room = await sync_to_async(Room.objects.get)(name=room_name)

        else:
            room = await sync_to_async(Room.objects.create)(name=room_name)

        self.room_group_name = room_name
        self.room_name = room.id
        self.scope['room_name'] = room.id

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
    

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
 
        message = text_data_json['message']
        sender_id = text_data_json['sender_id']
        receiver_id = text_data_json['receiver_id']
        room_name = text_data_json['room_name']

        room = await sync_to_async(Room.objects.get)(name=room_name)
        sender = await sync_to_async(Employee.objects.get)(id=sender_id)
        receiver = await sync_to_async(Employee.objects.get)(id=receiver_id)


        message = await sync_to_async(Message.objects.create)(
            content=message,
            room=room,
            sender=sender,
            receiver=receiver
        )


        serializer = MessageSerializer(message)


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message_details': serializer.data,
            }
        )

    async def chat_message(self, event):
        message = event['message_details']


        await self.send(text_data=json.dumps({
            'message': message,
        }))