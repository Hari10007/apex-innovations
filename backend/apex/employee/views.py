from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed, APIException
from .serializers import EmployeeSerializer, EmployeeDetailSerializer, ChangePasswordSerializer, DesignationSerializer, EmployeeUpdateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee, Designation
from rest_framework import status
from django.contrib.auth import authenticate
from django.core.paginator import Paginator
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from chat.serializers import EmployeeChatSerializer
# Create your views here.


class CheckConnectionView(APIView):
    def get(self, request):
        try:
            from django.db import connection
            connection.cursor()
        except Exception as e:
            return Response({'message': 'Backend is down', 'status': 'danger'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({'message': 'Backend is up', 'status': 'success'}, status=status.HTTP_200_OK)

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                access_token = str(token.access_token)
                refresh_token = str(token)
                response = {
                    'refresh': refresh_token,
                    'access': access_token
                }
                return Response(response, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        employee = Employee.objects.filter(email=email).first()

        if employee is None:
            raise AuthenticationFailed('Employee not found!')

        if not employee.check_password(password):
            raise AuthenticationFailed('Incorrect password!')


        token = RefreshToken.for_user(employee)

        token['id'] = employee.id
        token['email'] = employee.email
        token['image'] = employee.image and employee.image.url  or ""
        token['manager'] = employee.is_manager
        token['admin'] = employee.is_staff
        token['hr_manager'] = employee.is_hr_manager

        response_data = {
            'refresh': str(token),
            'access': str(token.access_token),
        }

        return Response(response_data)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response("Successfully Logout", status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)


class EmployeeProfile(APIView):
    def get(self, request):
        employee = request.user
        serializer = EmployeeDetailSerializer(employee)

        return Response(serializer.data)


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            employee = authenticate(email=request.user.email, password=serializer.validated_data['old_password'])
            if employee is not None:
                if serializer.validated_data['new_password'] == serializer.validated_data['confirm_password']:
                    employee.set_password(serializer.validated_data['new_password'])
                    employee.save()
                    return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'New passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'Invalid old password.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Password Fields is empty'}, status=status.HTTP_400_BAD_REQUEST)

class ListEmployees(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        admin = request.user
        if admin.is_admin:
            keyword = request.GET.get('keyword', '')
            page_number = request.GET.get('page', 1)
            items_per_page = request.GET.get('perPage', 10)

            if keyword and keyword.strip() != '':
                employees = Employee.objects.filter(Q(first_name__icontains=keyword) | Q(email__icontains=keyword),is_staff = False).order_by('-date_joined')[:10]
                
                serializer = EmployeeDetailSerializer(employees, many=True)
                result ={
                    "employees" : serializer.data,
                    "page_count" : 1,
                }
            else:
                employees = Employee.objects.filter(is_staff = False).order_by('-date_joined')
                
                paginator = Paginator(employees, items_per_page)
                page = paginator.page(page_number)
            
                serializer = EmployeeDetailSerializer(page, many=True)
                result ={
                    "employees" : serializer.data,
                    "page_count" : paginator.num_pages,
                }

            return Response(result, status=status.HTTP_200_OK)

class CheckEmployee(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        current_user = request.user
        employee_id = request.GET.get('employee_id')

        employee = Employee.objects.filter(id=int(employee_id)).first()

        if not employee:
            return Response({'message': 'Employee not present'}, status=status.HTTP_400_BAD_REQUEST)

        if employee == current_user:
            return Response({'message': 'You cannot chat yourself!'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = EmployeeChatSerializer(employee)
            return Response(serializer.data, status=status.HTTP_200_OK)

class ListManagers(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        current_user = request.user

        employee = Employee.objects.filter(is_manager= True).order_by('-date_joined')
        serializer = EmployeeDetailSerializer(employee, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListDesignations(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        current_user = request.user

        designations = Designation.objects.all()
        serializer = DesignationSerializer(designations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateDesignation(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        current_user = request.user

        name = request.data.get('name')
        designation = Designation.objects.create(name = name)
        return Response({'message': 'Designation Created Successfully', "status":'success'})


class CreateEmployee(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        current_user = request.user

        email = request.data.get('email')
        if Employee.objects.filter(email=email).exists():
            return Response({'error': 'Email is already in use', 'status': 'danger'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = EmployeeSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({'error': str(e), 'status': 'danger'}, status=status.HTTP_400_BAD_REQUEST)
        except APIException as e:
            return Response({'error': str(e.detail), 'status': 'danger'}, status=e.status_code)

class EmployeeDetails(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, employeeId):
        current_user = request.user

        employee_id = int(employeeId)
        employee= Employee.objects.get(id = employee_id)

        serializer = EmployeeUpdateSerializer(employee)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateEmployee(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, employeeId):
        current_user = request.user
        employee_id = int(employeeId)
        employee = Employee.objects.get(id = employee_id)

        employee.image = request.FILES.get('image',  employee.image)
        employee.first_name = request.data.get('first_name', employee.first_name)
        employee.last_name = request.data.get('last_name', employee.last_name)
        employee.email = request.data.get('email', employee.email)
        employee.phone = request.data.get('phone', employee.phone)

        designation_id = request.data.get('designation_id')
        if designation_id:
            try:
                designation = Designation.objects.get(id=int(designation_id))
                employee.designation = designation
            except Designation.DoesNotExist:
                return Response({'error': 'Invalid designation', 'status': 'danger'}, status=status.HTTP_400_BAD_REQUEST)
        
        manager_id = request.data.get('manager_id')
        if manager_id:
            try:
                manager = Employee.objects.get(id=int(manager_id))
                employee.parent = manager
            except Employee.DoesNotExist:
                return Response({'error': 'Invalid Manager', 'status': 'danger'}, status=status.HTTP_400_BAD_REQUEST)

        employee.city = request.data.get('city', employee.city)
        employee.state = request.data.get('state', employee.state)
        employee.date_joined = request.data.get('date_joined', employee.date_joined)
        employee.salary = request.data.get('salary', employee.salary)
        employee.qualification = request.data.get('qualification', employee.qualification)


        employee.save()

        return Response({'message': 'Employee Updated Successfully', "status":'success'})

class TotalEmployees(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        admin_count = Employee.objects.filter(is_staff=True, is_active = True).count()

        manager_count = Employee.objects.filter(is_staff=False, is_manager=True).count()

        hr_manager_count = Employee.objects.filter(is_staff=False, is_hr_manager=True, is_manager=True).count()

        other_employees_count = Employee.objects.exclude(
            Q(is_staff=True) | Q(is_manager=True) | Q(is_hr_manager=True)
        ).count()

        response_data = {
            'admins_count': admin_count,
            'managers_count': manager_count,
            'hr_managers_count': hr_manager_count,
            'employees_count': other_employees_count
        }

        return Response(response_data)