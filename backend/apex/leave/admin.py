from django.contrib import admin
from leave.models import Leave, EmployeeLeave

# Register your models here.

admin.site.register(Leave)
admin.site.register(EmployeeLeave)