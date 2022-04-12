from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import User, receita, comment
import json


def index(request):
    return render(request,"decidir/index.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is None:
            return render(request, "decidir/login.html",{
                "message":"Inválido username e/ou senha."
            })
        else:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
    
    return render(request, "decidir/login.html")

def register(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        passwordconf = request.POST['passwordconf']

        if not username or not email or not password or not passwordconf:
            return render(request, "decidir/register.html", {
                "message": "Todos os campos precisam ser preenchidos."
            })
        if password != passwordconf:
            return render(request, "decidir/register.html", {
                "message": "Senhas precisam ser iguais."
            })
        
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "decidir/register.html", {
                "message": "Username já está em uso."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    
    return render(request, "decidir/register.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

