from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class User(AbstractUser):
    pass

class receita(models.Model):
    name = models.CharField(max_length=50)
    img = models.CharField(max_length=500)
    ingredientes = models.CharField(max_length=800)
    calorias = models.FloatField(validators=[MinValueValidator(100)])
    carboidratos = models.FloatField()
    proteinas = models.FloatField()
    gorduras = models.FloatField()
    timestamp = models.CharField(max_length=30)
    likes = models.ManyToManyField(User,blank=True,related_name="liked")

