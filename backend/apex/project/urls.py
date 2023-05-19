from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CreateProject, ProjectStatusChoiceView, ListEmployees, ListProjects, ProjectDetails, UpdateProject, EmployeeProjects

urlpatterns = [
    path('status_choices', ProjectStatusChoiceView.as_view()),
    path('list_employees', ListEmployees.as_view()),
    path('create', CreateProject.as_view()),
    path('list_projects', ListProjects.as_view()),
    path('employee_projects', EmployeeProjects.as_view()),
    path('<projectId>', ProjectDetails.as_view()),
    path('update/<projectId>', UpdateProject.as_view()),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)