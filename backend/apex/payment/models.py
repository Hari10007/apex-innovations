from django.db import models
from employee.models import Employee

# Create your models here.

class BankAccount(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="bank_accounts")
    account_number = models.CharField(max_length=50)
    account_holder_name = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=11)
    bank_account_id = models.CharField(max_length=50)