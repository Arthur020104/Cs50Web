from django.contrib import admin

# Register your models here.
from .models import UserPerfil,User,Posts


    

admin.site.register(User)
admin.site.register(Posts)
admin.site.register(UserPerfil)
