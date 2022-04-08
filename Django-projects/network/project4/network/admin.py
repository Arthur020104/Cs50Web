from django.contrib import admin

# Register your models here.
from .models import UserPerfil,User,Posts

# Register your models here.

    

admin.site.register(User)
admin.site.register(Posts)
admin.site.register(UserPerfil)
