from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Project, EmployeeProject
from employee.models import Employee
from notification.models import Notification
from django.core.paginator import Paginator
from django.db.models import Q
from employee.serializers import EmployeeEmailSerializer
from .serializers import ProjectSerializer
import json 

# Create your views here.

class ListEmployees(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user
        employees = Employee.objects.filter(parent=employee)
        serializer = EmployeeEmailSerializer(employees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ProjectStatusChoiceView(APIView):
    def get(self, request, *args, **kwargs):
        status_choices = Project.STATUS_CHOICES
        return Response(status_choices)

class CreateProject(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        manager = request.user
        title = request.data['title']
        description = request.data['description']
        status = request.data['status']
        employee_mails = json.loads(request.data['employee_mails'])
        image = request.FILES.get('image')

        project = Project.objects.create(title = title, description = description, status = status , image=image, manager = manager)

        for email in employee_mails:
            employee = Employee.objects.get(email=email)

            EmployeeProject.objects.create(employee = employee, project = project)
            message = f"You are added to a project {project.title}"
            Notification.objects.create(employee = employee, message = message)

        return Response({'message': 'Project Created', "status":'success'})

class UpdateProject(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request, projectId):
        manager = request.user
        project_id = int(projectId)
        project = Project.objects.get(id = project_id)

        title = request.data['title']
        description = request.data['description']
        status = request.data['status']

        employee_mails = json.loads(request.data['employee_mails'])
        image = request.FILES.get('image')

        project.title = title
        project.description = description
        project.status = status
        if image:
            project.image = image

        project.save()

        for email in employee_mails:
            employee = Employee.objects.get(email=email)

            if not EmployeeProject.objects.filter(employee=employee, project=project).exists():
                EmployeeProject.objects.create(employee = employee, project = project)
                message = f"You are added to a project {project.title}"
                Notification.objects.create(employee = employee, message = message)
        
        employees_projects = EmployeeProject.objects.filter(project=project).exclude(employee__email__in=employee_mails)

        for employees_project in employees_projects:

            employee = employees_project.employee
            message = f"You are removed from the project {project.title}"
            Notification.objects.create(employee=employee, message=message)

        employees_projects.delete()


        return Response({'message': 'Project Updated', "status":'success'})


class ListProjects(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user

        keyword = request.GET.get('keyword', '')
        page_number = request.GET.get('page', 1)
        items_per_page = request.GET.get('perPage', 6)

        if employee.is_hr_manager:
            if keyword and keyword.strip() != '':
                projects = Project.objects.filter(Q(title__icontains=keyword) | Q(description__icontains=keyword)).order_by('-date_modified')[:6]
            else:
                projects = Project.objects.all().order_by('-date_modified')
        else:
            if keyword and keyword.strip() != '':
                projects = employee.projects.filter(Q(title__icontains=keyword) | Q(description__icontains=keyword)).order_by('-date_modified')[:6]
            else:
                projects = employee.projects.all().order_by('-date_modified')

        if not keyword:

            paginator = Paginator(projects, items_per_page)
            page = paginator.page(page_number)
        
            serializer = ProjectSerializer(page, many=True)
            result ={
                "project" : serializer.data,
                "page_count" : paginator.num_pages,
            }
        else:
            serializer = ProjectSerializer(projects, many=True)
            result ={
                "project" : serializer.data,
                "page_count" : 1,
            }
        
        return Response(result, status=status.HTTP_200_OK)

class EmployeeProjects(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee= request.user
        
        keyword = request.GET.get('keyword', '')
        page_number = request.GET.get('page', 1)
        items_per_page = request.GET.get('perPage', 6)
  
        if keyword and keyword.strip() != '':
            projects = Project.objects.filter(Q(title__icontains=keyword) | Q(description__icontains=keyword),employee_projects__employee=employee).order_by('-date_modified')[:6]
        else:
            projects = Project.objects.filter(employee_projects__employee=employee).order_by('-date_modified')

        if not keyword:
            paginator = Paginator(projects, items_per_page)
            page = paginator.page(page_number)
        
            serializer = ProjectSerializer(page, many=True)
            result ={
                "project" : serializer.data,
                "page_count" : paginator.num_pages,
            }
        else:
            serializer = ProjectSerializer(projects, many=True)
            result ={
                "project" : serializer.data,
                "page_count" : 1,
            }
        
        return Response(result, status=status.HTTP_200_OK)

class ProjectDetails(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, projectId):
        manager = request.user

        project_id = int(projectId)
        project= manager.projects.get(id = project_id)

        serializer = ProjectSerializer(project)

        return Response(serializer.data, status=status.HTTP_200_OK)