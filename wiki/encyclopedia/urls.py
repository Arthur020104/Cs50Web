from os import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:name>", views.search, name='search-page'),
    path("search/", views.search, name='search'),
    path("newpage/", views.newpage, name="newpage"),
    path("random/", views.random, name="random")
]
