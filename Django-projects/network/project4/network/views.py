from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.contrib.auth.decorators import login_required

from .models import User,UserPerfil, Posts

def index(request):
    post = Posts.objects.all().order_by("timestamp").reverse()
    p = Paginator(post,10)
    page = request.GET.get('page')
    posts = p.get_page(page)
    return render(request, "network/index.html",{
        "posts": posts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if not username or not email or not password or not confirmation:
            return render(request, "network/register.html", {
                "message": "All fields need to be filled."
            })
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            profile_user = UserPerfil(pk=user.id)
            profile_user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def perfil(request, profile):
    user_profile = User.objects.get(username=profile)
    followers = UserPerfil.objects.get(pk=user_profile)
    post = Posts.objects.filter(sender=user_profile.id).order_by("timestamp").reverse()
    p = Paginator(post,10)
    page = request.GET.get('page')
    posts = p.get_page(page)
    return render(request,"network/perfil.html",{
        "followers":followers.followers.all(),
        "user_profile": user_profile,
        "posts" :posts
        })

@csrf_exempt
def follow(request, user_id):
    if request.user.id is None:
        return HttpResponse(401)
    user = User.objects.get(pk=user_id)
    profile = UserPerfil.objects.get(pk=user)
    print(profile.user)
    print(user)
    print(request.user)
    if request.method == "POST":
        if request.user in profile.followers.all():
            user.profile.followers.remove(request.user)
            print(request.user)
            return HttpResponse(200)
        else:
            profile.followers.add(request.user)
            print(profile.followers.all()[0])
            return HttpResponse(200)
    return HttpResponse(401)

def posting(request):
    if request.user.id is None:
        return HttpResponseRedirect(reverse('login'))
    if request.method == "POST":
        if not request.POST["post"]:
            return render(request,"network/error.html",{"message":"Must type at least one word"})
        post = request.POST["post"]
        now = datetime.now()
        user = request.user
        p = Posts.objects.create(post=post,timestamp=now,sender=user)
        p.save()
        return HttpResponseRedirect(reverse('index'))
    return HttpResponse(401)

@login_required(redirect_field_name='login',login_url="login")
def following_page(request):
    user = request.user
    following = user.following.all()
    ids = []
    for follow in following:
        ids.append(follow.user.id)
    
    post = Posts.objects.filter(sender__in=ids).order_by("timestamp").reverse()
    p = Paginator(post,10)
    page = request.GET.get('page')
    posts = p.get_page(page)
    return render(request,"network/following.html",{
        "posts" :posts
        })

@csrf_exempt
def likes(request,post_id):
    if request.user.id is None:
        return HttpResponse(401)
    user = request.user
    post = Posts.objects.get(pk=post_id)
    if request.method == "POST":
        if user in post.likes.all():
            post.likes.remove(user)
            return JsonResponse({'post_id': post_id})
        else:
            post.likes.add(user)
            return JsonResponse({'post_id': post_id})
    return HttpResponse(401)