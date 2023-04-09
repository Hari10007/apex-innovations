from django.contrib import admin
from django.contrib.auth.admin import UserAdmin  as BaseUserAdmin
from .models import Employee, Designation


class AccountAdmin(BaseUserAdmin):
    model = Employee

    list_display = ('email', 'phone','date_joined')
    ordering = ('employee_id',)
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
    add_fieldsets = (
        (None, {
            'fields': ('email','phone', 'password1', 'password2')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name')
        })
    )


admin.site.register(Employee, AccountAdmin)
admin.site.register(Designation)