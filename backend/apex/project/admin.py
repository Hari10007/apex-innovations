from django.contrib import admin
from .models import Project, EmployeeProject

# Register the Project model
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'manager', 'status')


# Register the EmployeeProject model

@admin.register(EmployeeProject)
class EmployeeProjectAdmin(admin.ModelAdmin):
    list_display = ('employee', 'project')
