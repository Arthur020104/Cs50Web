from django.contrib import admin

# Register your models here.
from .models import User,receitas,comments

admin.site.register(User)
admin.site.register(receitas)
admin.site.register(comments)