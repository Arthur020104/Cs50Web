from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class User(AbstractUser):
    pass

class comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="my_comment")
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment_text = models.CharField(max_length=600)

class receita(models.Model):
    calorias = models.FloatField(validators=[MinValueValidator(100)])
    carboidratos = models.FloatField()
    proteinas = models.FloatField()
    gorduras = models.FloatField()
