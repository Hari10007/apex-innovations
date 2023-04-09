from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import HolidaySerializer
from .models import Holiday
from django.db.models.functions import ExtractYear
# Create your views here.


class ListHolidays(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        employee = request.user

        current_year = request.GET.get('year')

        if not current_year:
            current_year = timezone.now().year
        
        holidays = Holiday.objects.annotate(year=ExtractYear('date')).filter(year=current_year)

        serializer = HolidaySerializer(holidays, many=True)
        
        return Response(serializer.data)