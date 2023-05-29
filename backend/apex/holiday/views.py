from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import HolidaySerializer
from .models import Holiday
from django.db.utils import IntegrityError
from django.db.models.functions import ExtractYear, ExtractMonth
from datetime import datetime, date
# Create your views here.


class ListHolidays(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user

        current_year = request.GET.get('year')

        if not current_year:
            current_year = timezone.now().year
        
        holidays = Holiday.objects.annotate(year=ExtractYear('date'), month=ExtractMonth('date')).filter(year=current_year).order_by('month')

        serializer = HolidaySerializer(holidays, many=True)
        
        return Response(serializer.data)

class CreateHoliday(APIView):
    permission_classes = (IsAuthenticated, )
    def post(self, request):
        admin = request.user

        name = request.data.get('name')
        date_str = request.data.get('date')

        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'message': 'Invalid date format. Please provide the date in YYYY-MM-DD format.', 'status': 'danger'})

        current_year = date.today().year

        if date_obj.year  != current_year:
            return Response({'message': 'Invalid year. The holiday year must be the current year', 'status': 'danger'})

        try:
            holiday = Holiday.objects.get(name=name, date__year=current_year)
            return Response({'message': f'Holiday with the same name already exists for the year {current_year}', 'status': 'danger'})
        except Holiday.DoesNotExist:
            is_weekend = date_obj.weekday() >= 5
            if is_weekend:
                return Response({'message': 'Invalid date. Holidays cannot be on weekends', 'status': 'danger'})
            
            holiday = Holiday.objects.create(name=name, date=date_obj)
            return Response({'message': 'New Holiday Added', 'status': 'success'})

class UpdateHoliday(APIView):
    permission_classes = (IsAuthenticated, )
    def post(self, request, id):
        admin = request.user

        id = int(id)
        holiday = Holiday.objects.get(id = id)
        name = request.data.get('name')
        date = request.data.get('date')

        try:
            holiday.name = name
            holiday.date = date
            holiday.save()
        except IntegrityError:
            return Response({'message': 'Holiday with the same name and date already exists', 'status': 'danger'})

        return Response({'message': 'Holiday Update Successfully', "status":'success'})


class DeleteHoliday(APIView):
    permission_classes = (IsAuthenticated, )
    def delete(self, request, id):
        admin = request.user

        id = int(id)
        holiday = Holiday.objects.get(id = id)

        try:
            holiday = Holiday.objects.get(id=id)
            holiday.delete()
            return Response({'message': 'Holiday deleted Successfully', 'status': 'success'})
        except Holiday.DoesNotExist:
            return Response({'message': 'Holiday not found', 'status': 'error'}, status=status.HTTP_404_NOT_FOUND)