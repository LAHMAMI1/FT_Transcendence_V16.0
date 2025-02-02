from django.db import models
from django.contrib.auth.models import AbstractUser

# User model
class User(AbstractUser):
    first_name = models.CharField(max_length=30, blank=False, null=False)
    last_name = models.CharField(max_length=30, blank=False, null=False)
    middle_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField(unique=True)
    
    class Meta:
        db_table = "User"