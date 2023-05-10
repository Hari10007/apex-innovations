from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from .serializers import EmployeeSerializer, EmployeeDetailSerializer, ChangePasswordSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee
from rest_framework import status
from django.contrib.auth import authenticate
from django.core.paginator import Paginator
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from chat.serializers import EmployeeChatSerializer

# Create your views here.

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