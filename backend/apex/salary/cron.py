from django.utils import timezone
from employee.models import Employee
from .models import EmployeeSalary
from django_cron import CronJobBase, Schedule

class CreateEmployeeSalaryCronJob(CronJobBase):
    RUN_AT_TIMES = ['00:00 1 * ']

    schedule = Schedule(run_at_times=RUN_AT_TIMES)
    code = 'employee.create_employee_salary_cron_job'

    def do(self):
        create_employee_salary()

    def create_employee_salary():
        current_month = timezone.now().month
        current_year = timezone.now().year
        

        if current_month == 1:
            previous_month = 12
            previous_year = current_year - 1
        else:
            previous_month = current_month - 1
            previous_year = current_year
        
        employees = Employee.objects.filter(is_admin=False).all()
        

        for employee in employees:
            employee_salary = EmployeeSalary.objects.filter(employee=employee, salary_date__year=previous_year, salary_date__month=previous_month).first()
            if employee_salary:
                continue
            
            basic_salary = employee.salary
            over_time_salary = 0
            total_salary = basic_salary + over_time_salary
            employee_salary = EmployeeSalary(employee=employee, basic_salary=basic_salary, over_time_salary=over_time_salary, total_salary=total_salary, status=True, salary_date=timezone.datetime(previous_year, previous_month, 1))
            employee_salary.save()
            