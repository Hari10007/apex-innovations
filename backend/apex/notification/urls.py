from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import ListNotification, ResetNotification

urlpatterns = [
    path('notifications', ListNotification.as_view()),
    path('reset_notification', ResetNotification.as_view())
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)