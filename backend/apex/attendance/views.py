from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import AttendanceSerializer
from django.utils import timezone
from .models import Attendance, CheckInOut
from rest_framework import status
from django.core.paginator import Paginator

# Create your views here.
class AttendanceStatus(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user

        current_date = request.GET.get('date')

        attendance = Attendance.objects.filter(employee=employee, date=current_date).first()
    
        if attendance:
            if attendance.check_in_outs.exists():
                check_status = attendance.check_in_outs.all().last().is_check_in
                return Response({'status': f'{check_status}'})
            else:
                return Response({'status': 'false'})
        else:
            return Response({'status': 'false'})

class AttendanceLog(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user
        current_date = request.GET.get('date')

        attendance = Attendance.objects.filter(employee=employee, date=current_date).first()
        if attendance:
            check_in_out_list = []
            for check_in_out in attendance.check_in_outs.all():
                check_in_out_dict = {
                    'is_check_in': check_in_out.is_check_in,
                    'time': check_in_out.time,
                }
                check_in_out_list.append(check_in_out_dict)
            return Response({'log': check_in_out_list})
        else:
            return Response({'message':"Log not found"})       


class ListAttendance(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user
        date =  request.GET.get('date')
        
        page_number = request.GET.get('page')
        items_per_page = request.GET.get('perPage')
        if date == "false":
            attendances = employee.attendances.all().order_by('-date')
        else:
            attendances = employee.attendances.all().filter(date=date)
        paginator = Paginator(attendances, items_per_page)
        page = paginator.get_page(page_number)

        serializer = AttendanceSerializer(attendances, many=True)
        
        return Response(serializer.data)
        

class CheckIn(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        current_time = request.data.get('time') 
        current_date = request.data.get('date') 
        attendance , created = Attendance.objects.get_or_create(employee=request.user, date=current_date)

        check_in_out = CheckInOut.objects.create(attendance=attendance, is_check_in=True, time=current_time)

        return Response({'message': f'Check in at {check_in_out.time}'})

class CheckOut(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        current_time = request.data.get('time') 
        current_date = request.data.get('date') 
        attendance , created = Attendance.objects.get_or_create(employee=request.user, date=current_date)

        check_in_out = CheckInOut.objects.create(attendance=attendance, is_check_in=False, time=current_time)
        attendance.update_working_time()

        return Response({'message': f'Check out at {check_in_out.time}'})