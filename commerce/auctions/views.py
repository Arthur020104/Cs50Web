from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import datetime
from django.contrib.auth.decorators import login_required

from .models import User, Product, Category


def index(request):
    
    if Product.objects.all():
        return render(request, "auctions/index.html",{
           "activeProdu": Product.objects.exclude(status="disabled").all()
        })
    else:
        return render(request, "auctions/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST.get["username"]
        password = request.POST.get["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required(redirect_field_name='login')
def newproduct(request):
    categoryy = Category.objects.all()
    if request.method == "POST":
        if not request.POST["productname"] and request.POST["productprice"] and request.POST["productabout"] and request.POST["img"] and request.POST["Categories"] in (categoryy.name):
            return render(request, "auctions/NewProduct.html", {
                "message":"All fields must be filled",
                "Categories":categoryy
            })
        else:
            if Category.objects.get(pk = int(request.POST["Categories"])) != [] :
                p = Product(userwining = request.user,bids_count = 0, current_bid = float(request.POST["productprice"]), creator = request.user, img = request.POST["img"], name = request.POST["productname"], about = request.POST["productabout"], time_created = datetime.date.today(), status = "Active", category = Category.objects.get(pk = int(request.POST["Categories"])))
                p.save()

                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, "auctions/NewProduct.html", {
                "message":"Something has gone wrong.",
                "Categories":categoryy
            })
        

    return render(request, "auctions/NewProduct.html",{
        "Categories":categoryy
    })
@login_required(redirect_field_name='login')
def product(request, Product_id):
    if request.method == "POST":
        if request.POST["newbid"]:
            product = Product.objects.get(pk=Product_id)
            if not float(request.POST["newbid"]) > product.current_bid:
                return render(request, "auctions/Product.html", {
                "Product":Product.objects.get(pk=Product_id),
                "message":"Your bid must be bigger that the current one."
            })
            else:
                product.current_bid = float(request.POST["newbid"])
                product.bids_count += 1
                product.userwining = request.user
                product.save()
                return render(request, "auctions/Product.html", {
                "Product":Product.objects.get(pk=Product_id),
                "newbid":"Your bid has been made."
            })
        else:
            return render(request, "auctions/Product.html", {
                "Product":Product.objects.get(pk=Product_id),
                "message":"Must submit something."
            })
    else:
        return render(request, "auctions/Product.html", {
            "Product":Product.objects.get(pk=Product_id),
        })
@login_required(redirect_field_name='login')
def watchlist(request):
    if request.method == "POST":
        product = Product.objects.get(pk=int(request.POST["product_id"]))
        product.onwatch.add(request.user)
        product.save()
        return render(request, "auctions/Watchlist.html", {
        "Products":Product.objects.filter(onwatch = request.user)
        })
    if request.method == "GET":
        return render(request, "auctions/Watchlist.html", {
        "Products":Product.objects.filter(onwatch = request.user)
        })
def disable(request, Product_id):
    if request.method == "POST":
        product = Product.objects.get(pk=Product_id)
        if request.user == product.creator:
            product.status = "disabled"
            product.save()
            return HttpResponseRedirect(reverse('product', kwargs={'Product_id': '2'}))
        else:
           return HttpResponseRedirect(reverse('product', kwargs={'Product_id': '2'}))