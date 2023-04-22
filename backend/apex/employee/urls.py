from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import RegisterView, RefreshTokenView, LoginView, LogoutView, EmployeeProfile, ChangePasswordView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
    path('login', LoginView.as_view()),
    path('profile', EmployeeProfile.as_view()),
    path('update_password', ChangePasswordView.as_view()),
    path('logout', LogoutView.as_view()),
    # path('notification', ListNotification.as_view())
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)