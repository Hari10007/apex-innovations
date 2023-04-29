from rest_framework.views import APIView
from django.core.paginator import Paginator
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .serializers import EmployeeSalarySerializer
from .models import EmployeeSalary, EmployeeSalarySlip
from employee.models import Employee
from rest_framework import status
from datetime import datetime
from django.db.utils import IntegrityError

# Create your views here.


class ListSalaryLog(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        admin = request.user
        if admin.is_admin:
            employee_id = request.GET.get('employee')
            page_number = request.GET.get('page', 1)
            items_per_page = request.GET.get('perPage', 10)
            salary_date = request.GET.get('date')
           
            # employee_salaries = EmployeeSalary.objects.filter(salary_date__month=date.month, salary_date__year=date.year)

            employee = Employee.objects.get(id=employee_id)

            if salary_date:
                formatted_date = datetime.strptime(salary_date, '%m %Y').date()
                employee_salaries = EmployeeSalary.objects.filter(employee=employee, salary_date__month=formatted_date.month, salary_date__year=formatted_date.year).order_by('-salary_date')[:10]
                
                serializer = EmployeeSalarySerializer(employee_salaries, many=True)
                result ={
                    "employee_salaries" : serializer.data,
                    "page_count" : 1,
                }
            else:
                employee_salaries = EmployeeSalary.objects.filter(employee=employee).order_by('-salary_date')
                
                paginator = Paginator(employee_salaries, items_per_page)
                page = paginator.page(page_number)
            
                serializer = EmployeeSalarySerializer(page, many=True)
                result ={
                    "employee_salaries" : serializer.data,
                    "page_count" : paginator.num_pages,
                }

            return Response(result, status=status.HTTP_200_OK)
        
class GenerateSlip(APIView):
    permission_classes = (IsAuthenticated, )
    def post(self, request):
        admin = request.user
        if admin.is_admin:
            employee_id = request.data.get('employee')
            salary_id = request.data.get('employee_salary')
            date = request.data.get('date')

            employee = Employee.objects.get(id=employee_id)
            employee_salary = EmployeeSalary.objects.get(id=salary_id)

            try:
                salary_slip = EmployeeSalarySlip.objects.create(employee_salary = employee_salary, date = date)
            except IntegrityError:
                return Response({'message': 'Already Generated', 'status': 'danger'})

            return Response({'message': 'Salary Slip created', 'status': 'success'})