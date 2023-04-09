from django.contrib import admin
from .models import Attendance, CheckInOut

# Register your models here.
admin.site.register(Attendance)
admin.site.register(CheckInOut)