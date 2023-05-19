from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import ListSalaryLog, GenerateSlip, PaySalary, PaySlipRequest, PaySlipRequestCount

urlpatterns = [
    path('list', ListSalaryLog.as_view()),
    path('generate_slip', GenerateSlip.as_view()),
    path('create', PaySalary.as_view()),
    path('payslip_request', PaySlipRequest.as_view()),
    path('request/<employeeId>', PaySlipRequestCount.as_view())
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)