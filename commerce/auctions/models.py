from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Category(models.Model):
    name = models.CharField(max_length=100)

class Product(models.Model):
    name = models.CharField(max_length=64)
    about = models.CharField(max_length=1000)
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="usernames")
    time_created = models.CharField(max_length=18)
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, related_name="category")
    status = models.CharField(max_length=8)
    onwatch = models.ManyToManyField(User, blank=True, related_name="buyers")
    img = models.CharField(max_length=10000)
    current_bid = models.FloatField()
    bids_count = models.IntegerField()
    userwining = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="currentwinner")
