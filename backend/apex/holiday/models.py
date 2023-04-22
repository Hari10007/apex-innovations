from django.db import models

# Create your models here.
class Holiday(models.Model):
    name = models.CharField(max_length = 50, unique=True, blank=True)
    date = models.DateField(unique=True)

    def __str__(self):
        return str(self.name)
