from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import CheckIn, CheckOut, ListAttendance, AttendanceStatus, AttendanceLog, AttendanceCreate, ListRequestAttendance, RequestApprove, RequestReject

urlpatterns = [
    path('list', ListAttendance.as_view()),
    path('request/list', ListRequestAttendance.as_view()),
    path('check_in', CheckIn.as_view()),
    path('check_out', CheckOut.as_view()),
    path('status',AttendanceStatus.as_view()),
    path('log',AttendanceLog.as_view()),
    path('create', AttendanceCreate.as_view()),
    path('request_approve', RequestApprove.as_view()),
    path('request_reject', RequestReject.as_view()),

]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)