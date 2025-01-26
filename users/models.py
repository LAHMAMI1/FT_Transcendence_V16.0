from django.db import models
from django.contrib.auth.hashers import make_password

# User model
class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    
    def save(self, *args, **kwargs):
        if self.password and len(self.password) > 0:
            self.password = make_password(self.password, None, 'argon2')
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = "User"

    