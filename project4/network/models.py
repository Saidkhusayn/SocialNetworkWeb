from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="owner")
    content = models.CharField(max_length=300)
    timestap = models.DateTimeField(auto_now_add=True)

