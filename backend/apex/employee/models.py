from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager
from django.db.models.signals import pre_save
from django.dispatch import receiver

# Create your models here.
class Designation(models.Model):
    name = models.CharField(max_length=50)

class MyAccountManager(BaseUserManager):
    def create_user(self , email, password, **extra_fields):
        if not email:
            raise ValueError("Employee must have a email")


        employee = self.model(
            email = self.normalize_email(email),
            password = password,
            **extra_fields
        )

        employee.set_password(password)
        employee.save(using=self._db)
        return employee
    
    def create_superuser(self ,email, password, **extra_fields):
        employee = self.create_user(
            email = self.normalize_email(email),
            password = password,
            **extra_fields
        )

        employee.is_admin = True
        employee.is_staff = True
        employee.is_active = True
        employee.is_superuser = True
        employee.save(using=self._db)
        return employee

class Employee(MPTTModel, AbstractBaseUser):
    first_name = models.CharField(max_length = 50, blank=True)
    last_name = models.CharField(max_length = 50, blank=True)
    email  = models.EmailField(max_length = 100, unique = True)
    image = models.ImageField(upload_to='profiles/', blank=True)
    phone = models.CharField(max_length = 50, blank=True, null=True)
    employee_id = models.CharField(max_length = 50,unique = True)

    parent = TreeForeignKey('self', related_name='employees', on_delete=models.SET_NULL, blank=True, null=True)
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, blank=True, null=True)
    schedule = models.CharField(max_length = 50, blank=True)
    qualification = models.CharField(max_length = 50, blank=True)
    date_joined = models.DateField(auto_now_add = True)
    city = models.CharField(max_length = 50, blank=True)
    state = models.CharField(max_length = 50, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.BooleanField(default=True)
    customer_id = models.CharField(max_length=50, blank=True)
    
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    is_hr_manager = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['employee_id']

    objects = MyAccountManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    def has_module_perms(self, app_label):
        return self.is_admin
    
    def name(self):
        return f"{self.first_name} {self.last_name}"

    def leaves_left_year(self):
        leave = {}
        current_year = datetime.now().year
        for leave, days_per_month, days_per_year in Leave.LEAVE_TYPES:
            if days_per_year > 0:
                leaves_taken = EmployeeLeave.objects.filter(
                    employee=self,
                    leave_type=leave_type,
                    status='A',
                    start_date__year=current_year,
                ).aggregate(Sum('taken_days'))['taken_days__sum'] or 0
                leaves_left[leave_type] = days_per_year - leaves_taken
        return leaves_left

@receiver(pre_save, sender=Employee)
def set_employee_id(sender, instance, **kwargs):
    if not instance.pk:
        instance.employee_id = "AP" + str(Employee.objects.count() + 1).zfill(3)

