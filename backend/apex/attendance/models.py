from django.db import models
from employee.models import Employee
from datetime import datetime, timedelta


# Create your models here.

class Attendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendances")
    date = models.DateField()
    working_time = models.DurationField(null=True, blank=True)

    def update_working_time(self):
        check_ins = self.check_in_outs.filter(is_check_in=True).order_by('time')
        check_outs = self.check_in_outs.filter(is_check_in=False).order_by('time')

        if check_ins.count() > check_outs.count():
            last_check_out = check_outs.last().time
            work_hours = datetime.combine(self.date, last_check_out) - datetime.combine(self.date, check_ins.first().time)
        else:
            work_hours = sum((datetime.combine(self.date, check_out.time) - datetime.combine(self.date, check_in.time) for check_in, check_out in zip(check_ins, check_outs)), timedelta())

        self.working_time = work_hours
        self.save()
    
    def __str__(self):
        return self.date.strftime('%Y-%m-%d')


class CheckInOut(models.Model):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE,related_name="check_in_outs")
    is_check_in = models.BooleanField(default=False)
    time = models.TimeField(null=True)

    def __str__(self):
        return str(self.attendance.id)
