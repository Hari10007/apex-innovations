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
from notification.models import Notification

# Create your views here.


class ListSalaryLog(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        current_employee = request.user
        if current_employee.is_admin:
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
        else:
            page_number = request.GET.get('page', 1)
            items_per_page = request.GET.get('perPage', 10)
            salary_date = request.GET.get('date')
           
            # employee_salaries = EmployeeSalary.objects.filter(salary_date__month=date.month, salary_date__year=date.year)


            if salary_date:
                formatted_date = datetime.strptime(salary_date, '%m %Y').date()
                employee_salaries = EmployeeSalary.objects.filter(employee=current_employee, salary_date__month=formatted_date.month, salary_date__year=formatted_date.year).order_by('-salary_date')[:10]
                
                serializer = EmployeeSalarySerializer(employee_salaries, many=True)
                result ={
                    "employee_salaries" : serializer.data,
                    "page_count" : 1,
                }
            else:
                employee_salaries = EmployeeSalary.objects.filter(employee=current_employee).order_by('-salary_date')
                
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
                if employee_salary.payslip_request:
                    employee_salary.payslip_request = False
                    employee_salary.save()
            except IntegrityError:
                return Response({'message': 'Already Generated', 'status': 'danger'})

            return Response({'message': 'Salary Slip created', 'status': 'success'})

class PaySalary(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        admin = request.user

        if admin.is_admin:
            employee_id = request.data.get('employee')
            basic_salary = float(request.data.get('salary'))
            over_time_salary = 0
            total_salary = basic_salary + over_time_salary
            salary_date_str  = request.data.get('date')

            salary_date = datetime.strptime(salary_date_str, '%Y-%m-%d')
            employee = Employee.objects.get(id=employee_id)
            employee_salary  = EmployeeSalary.objects.filter(employee= employee, salary_date=salary_date)

            current_date = datetime.now()
            if salary_date.year > current_date.year or (salary_date.year == current_date.year and salary_date.month >= current_date.month):
                return Response({'message': 'Invalid salary date', 'status': 'danger'})

            if employee_salary.exists():
                return Response({'message': 'Already Generated', 'status': 'danger'})
            else:
                employee_salary = EmployeeSalary.objects.create(employee = employee, basic_salary=basic_salary, over_time_salary=over_time_salary, total_salary=total_salary, status=True, salary_date = salary_date_str)
                return Response({'message': 'Salary Paid', 'status': 'success'})

class PaySlipRequest(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        current_employee = request.user
        admin = Employee.objects.get(email="harikrishnansr007@gmail.com")

        employee_salary_id = request.data.get('employee_salary')
        employee_salary = EmployeeSalary.objects.get(id = int(employee_salary_id))
        if employee_salary.payslip_request:
            return Response({'message': 'Already Requested', 'status': 'danger'})
        else:
            employee_salary.payslip_request = True
            employee_salary.save()
            message = f"{current_employee.name()} has requested the payslip of {employee_salary.salary_date}"
            Notification.objects.create(employee = admin , message = message)
            return Response({'message': 'Payslip Requested', 'status': 'success'})

class PaySlipRequestCount(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, employeeId):
        current_employee = request.user
        
        id = int(employeeId)
        employee = Employee.objects.get(id = id)

        payslip_request_count = EmployeeSalary.objects.filter(employee=employee, payslip_request=True).count()
        return Response({payslip_request_count}, status=status.HTTP_200_OK)