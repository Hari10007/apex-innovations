from django.db import models
from employee.models import Employee
from django.db.models import Sum
import decimal

# Create your models here.

class Leave(models.Model):
    name = models.CharField(max_length=50, unique=True)
    days_per_year = models.PositiveIntegerField(default=0)
    days_per_month = models.PositiveIntegerField(default=0)

class EmployeeLeave(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pending'),
        ('A', 'Approved'),
        ('R', 'Rejected'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="employee_leaves")
    leave = models.ForeignKey(Leave, on_delete=models.CASCADE, related_name="employee_leaves")
    start_date = models.DateField()
    end_date = models.DateField()
    half_day = models.BooleanField(default=False)
    reason = models.TextField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    taken_days = models.DecimalField(max_digits=3, decimal_places=1, default=0)

    def save(self, *args, **kwargs):
        
        if self.half_day:
            days = ((self.end_date - self.start_date).days + 1) * 0.5
        else:
            days = (self.end_date - self.start_date).days + 1

        self.taken_days = days

        leave = self.leave
        if leave.days_per_month > 0 or leave.days_per_year > 0:
            current_month = self.start_date.month
            current_year = self.start_date.year
            
            taken_days = EmployeeLeave.objects.filter(
                employee=self.employee,
                leave=self.leave,
                status='A',
                start_date__month=current_month,
                start_date__year=current_year,
            ).aggregate(Sum('taken_days'))['taken_days__sum'] or 0

            if decimal.Decimal(str(self.taken_days)) + decimal.Decimal(taken_days) > (leave.days_per_month or leave.days_per_year):
                self.status = 'R'

        super(EmployeeLeave, self).save(*args, **kwargs)