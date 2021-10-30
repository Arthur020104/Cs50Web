from django.urls import path
from django.contrib import admin
from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("NewProduct", views.newproduct, name="newprod"),
    path("<int:Product_id>/Product", views.product, name="product"),
    path("Watchlist", views.watchlist, name="watchlist"),
    path("<int:Product_id>/disable", views.disable, name="disable")
]
