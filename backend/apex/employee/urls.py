
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from .views import RegisterView, RefreshTokenView, LoginView, AdminLoginView, ManagerLoginView, LogoutView, EmployeeProfile, ChangePasswordView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
    path('login', LoginView.as_view()),
    path('profile', EmployeeProfile.as_view()),
    path('admin_login', AdminLoginView.as_view()),
    path('manager_login', ManagerLoginView.as_view()),
    path('update_password', ChangePasswordView.as_view()),
    path('logout', LogoutView.as_view())
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)