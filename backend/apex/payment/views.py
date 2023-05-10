from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import BankAccount
from rest_framework import status


# Create your views here.


class AddAccount(APIView):
    permission_classes = (IsAuthenticated,)
    def get_stripe_customer_id(self, employee):
        if not employee.customer_id:
            customer_id = self.create_stripe_customer(employee)
        else:
            customer_id = employee.customer_id
        
        return customer_id

    def create_stripe_customer(self, employee):
        customer = stripe.Customer.create(email=employee.email)
        employee.customer_id = customer.id
        employee.save()

        return customer.id

    def post(self, request):
        account_number = request.data.get('account_number') 
        account_holder_name = request.data.get('name') 
        ifsc_code = request.data.get('ifsc_code') 
        
        employee = request.user

        bank_account = BankAccount.objects.create(
            employee = employee,
            account_number=account_number,
            account_holder_name=account_holder_name,
            ifsc_code=ifsc_code,
        )


        return Response({'message': 'Bank account added successfully'}, status=status.HTTP_200_OK)

        