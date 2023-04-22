from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import ListHolidays, CreateHoliday, UpdateHoliday, DeleteHoliday

urlpatterns = [
    path('list', ListHolidays.as_view()),
    path('create', CreateHoliday.as_view()),
    path('update/<id>', UpdateHoliday.as_view()),
    path('delete/<id>', DeleteHoliday.as_view()),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)