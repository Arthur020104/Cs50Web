from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    def __str__(self):
        return f"{self.id}: {self.username} {self.email}"

class Posts(models.Model):
    post = models.CharField(max_length=5000)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="my_post")
    timestamp = models.CharField(max_length=30)
    likes = models.ManyToManyField(User,blank=True,related_name="liked")
    
    def __str__(self):
        return f"Postado as {self.timestamp} por {self.sender}.Conteudo: {self.post}"

class UserPerfil(models.Model):
    user = models.OneToOneField(User, primary_key=True, related_name="profile", on_delete=models.CASCADE)
    followers = models.ManyToManyField(User,blank=True,related_name="following")