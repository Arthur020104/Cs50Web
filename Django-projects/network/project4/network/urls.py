
from unicodedata import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("Profile/<str:profile>", views.perfil, name="profile"),
    path("Profile/follow/<int:user_id>", views.follow, name="follow"),
    path("posting", views.posting, name="posting"),
    path("following", views.following_page, name="following"),
    path("like/<int:post_id>", views.likes, name="like"),
    path("editpost", views.post_edit , name="edit_post")
]
