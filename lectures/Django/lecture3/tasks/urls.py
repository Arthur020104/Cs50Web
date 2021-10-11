from django.urls import path
from . import views

app_name = "tasks"
urlpatterns = [
    path("", views.index, name='index'),
    path("Add_task/", views.Add_task, name="Add_task")
]