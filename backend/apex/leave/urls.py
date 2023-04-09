from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import LeaveCount, LeaveLists, LeaveTypes, LeaveRequest, LeaveRequestsList, LeaveDetails, LeaveApprove, LeaveReject

urlpatterns = [
    path('status', LeaveCount.as_view()),
    path('list', LeaveLists.as_view()),
    path('leave_types', LeaveTypes.as_view()),
    path('leave_request', LeaveRequest.as_view()),
    path('leave_requests', LeaveRequestsList.as_view()),
    path('leave_requests/<id>', LeaveDetails.as_view()),
    path('leave_requests/<id>/approve', LeaveApprove.as_view()),
    path('leave_requests/<id>/reject', LeaveReject.as_view()),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)