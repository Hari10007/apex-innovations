from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CheckIn, CheckOut, ListAttendance, AttendanceStatus, AttendanceLog

urlpatterns = [
    path('attendance/list', ListAttendance.as_view()),
    path('attendance/check_in', CheckIn.as_view()),
    path('attendance/check_out', CheckOut.as_view()),
    path('attendance/status',AttendanceStatus.as_view()),
    path('attendance/log',AttendanceLog.as_view()),

]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)