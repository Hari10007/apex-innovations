# Generated by Django 4.1.7 on 2023-04-19 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holiday', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='holiday',
            name='date',
            field=models.DateField(unique=True),
        ),
        migrations.AlterField(
            model_name='holiday',
            name='name',
            field=models.CharField(blank=True, max_length=50, unique=True),
        ),
    ]
