from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from .serializers import EmployeeSerializer, EmployeeDetailSerializer, ChangePasswordSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Employee
from rest_framework import status
from django.contrib.auth import authenticate


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

        employee = Employee.objects.filter(email=email, is_staff = False).first()

        if employee is None:
            raise AuthenticationFailed('Employee not found!')

        if not employee.check_password(password):
            raise AuthenticationFailed('Incorrect password!')


        token = RefreshToken.for_user(employee)

        token['id'] = employee.id
        token['email'] = employee.email
        token['image'] = employee.image and "http://localhost:8000/api"+ employee.image.url  or ""

        response_data = {
            'refresh': str(token),
            'access': str(token.access_token),
        }

        return Response(response_data)

class AdminLoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        employee = Employee.objects.filter(email=email , is_staff = True).first()

        if employee is None:
            raise AuthenticationFailed('Admin not found!')

        if not employee.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        token = RefreshToken.for_user(employee)

        token['id'] = employee.id
        token['email'] = employee.email
        token['admin'] = employee.is_staff
        token['manager'] = employee.is_manager
        token['image'] = employee.image and "http://localhost:8000/api"+ employee.image.url  or ""

        response_data = {
            'refresh': str(token),
            'access': str(token.access_token),
        }

        return Response(response_data)

class ManagerLoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        employee = Employee.objects.filter(email=email , is_manager = True).first()

        if employee is None:
            raise AuthenticationFailed('Manager not found!')

        if not employee.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        token = RefreshToken.for_user(employee)

        token['id'] = employee.id
        token['email'] = employee.email
        token['manager'] = employee.is_manager
        token['image'] = employee.image and "http://localhost:8000/api"+ employee.image.url  or ""

        print(token)
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
            print(token)
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
        print(request.data)
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