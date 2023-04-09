from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Leave, EmployeeLeave
from django.db.models.functions import ExtractYear
from django.db.models import Sum
from .serializers import EmployeeLeaveSerializer, LeaveSerializer
from django.core.paginator import Paginator
import datetime
from rest_framework import status
from django.core.mail import send_mail
# Create your views here.


class LeaveCount(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user
        current_year = request.GET.get('year')

        leaves = Leave.objects.all()

        for leave in leaves:
            if leave.name == "Casual":
                causal_leaves_left = leave.days_per_year - (EmployeeLeave.objects.filter(employee=employee, leave__name=leave.name, start_date__year=current_year, status='A').aggregate(Sum('taken_days'))['taken_days__sum'] or 0)
            elif leave.name == 'Sick':
                sick_leaves_left = leave.days_per_year - (EmployeeLeave.objects.filter(employee=employee, leave__name=leave.name, start_date__year=current_year, status='A').aggregate(Sum('taken_days'))['taken_days__sum'] or 0)
            elif leave.name == 'Paid':
                paid_leaves_left = leave.days_per_year - (EmployeeLeave.objects.filter(employee=employee, leave__name=leave.name, start_date__year=current_year, status='A').aggregate(Sum('taken_days'))['taken_days__sum'] or 0)

        leaves_left = {
            'Casual': causal_leaves_left,
            'Sick': sick_leaves_left,
            'Paid': paid_leaves_left,
        }
        return Response(leaves_left)

class LeaveLists(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user

        page_number = request.GET.get('page')
        items_per_page = request.GET.get('perPage')

        employee_leaves = employee.employee_leaves.all().order_by('-id')
        paginator = Paginator(employee_leaves, items_per_page)
        page = paginator.get_page(page_number)

        serializer = EmployeeLeaveSerializer(employee_leaves, many=True)
        
        return Response(serializer.data)

class LeaveTypes(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        leaves = Leave.objects.all()
        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)

class LeaveRequest(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        employee = request.user
        leave_type = request.data.get('leave_type')
        start_date = datetime.datetime.strptime(request.data.get('start_date'), '%Y-%m-%d').date()
        end_date = datetime.datetime.strptime(request.data.get('end_date'), '%Y-%m-%d').date()
        half_day = request.data.get('half_day')
        reason = request.data.get('reason')
        
        leave = Leave.objects.get(name = leave_type)

        employee_leaves = EmployeeLeave.objects.filter(
            employee=employee,
            leave=leave,
            status__in=['A', 'P'],
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if employee_leaves.exists():
            return Response({'message': 'Already Applied leave',  "status":'danger'})

        employee_leave = EmployeeLeave.objects.create(employee = employee, leave = leave, start_date = start_date, end_date = end_date, half_day = half_day, reason = reason)

        if employee_leave:
            if employee_leave.status == "R":
                return Response({'message': 'No Leaves Left', "status":'danger'})
            else:
                manager_email = employee.parent.email
                if manager_email:
                    title = 'Leave Request'

                    message = f"Respected {employee.parent.first_name},\n\n{employee.first_name} {employee.last_name} has submitted a leave request for {leave_type} leave from {start_date} to {end_date}.\n\nReason: {reason}\n\nPlease click on the following link to view the leave request: <insert link here>\n\nThank you,\nApex Innovations"

                    from_email = employee.email
                    recipient_list = [manager_email]

                    send_mail(title, message, from_email, recipient_list, fail_silently=False)

                return Response({'message': 'Applied Leave', "status":'success'})
        else:
             return Response({'message': 'Unable to apply for leave',  "status":'danger'})

class LeaveRequestsList(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        manager = request.user

        page_number = request.GET.get('page')
        items_per_page = request.GET.get('perPage')

        employee_leaves = EmployeeLeave.objects.filter(employee__in=manager.employees.all()).order_by('-id')
        paginator = Paginator(employee_leaves, items_per_page)
        page = paginator.get_page(page_number)

        serializer = EmployeeLeaveSerializer(page, many=True)

        return Response(serializer.data)

class LeaveDetails(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, id):
        manager = request.user

        leave_id = int(id)
        employee_leave = EmployeeLeave.objects.get(id = leave_id)

        serializer = EmployeeLeaveSerializer(employee_leave)

        return Response(serializer.data)

class LeaveApprove(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request, id):
        manager = request.user
        leave_id = int(id)
        employee_leave = EmployeeLeave.objects.get(id = leave_id)
        employee_leave.status = "A"
        employee_leave.save()
        return Response({'message': 'Leave Approved', "status":'success'})

class LeaveReject(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request, id):
        manager = request.user
        leave_id = int(id)
        employee_leave = EmployeeLeave.objects.get(id = leave_id)
        employee_leave.status = "R"
        employee_leave.save()
        return Response({'message': 'Leave Rejected', "status":'danger'})