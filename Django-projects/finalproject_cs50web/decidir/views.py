from unicodedata import name
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import User, receita
import json
from googletrans import Translator
from datetime import datetime


def index(request):
    receitas = receita.objects.all().order_by("timestamp").reverse()
    for tms in receitas:
        tms.timestamp = datetime.fromtimestamp(float(tms.timestamp))
    p = Paginator(receitas,10)
    page = request.GET.get('page')        
    receitass = p.get_page(page)
    return render(request,"decidir/index.html",{
        "receitas": receitass
    })

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

def comments(request):
    pass
#json post e get

@csrf_exempt
def create_recipe(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        calorias = float(data.get("calorias", ""))
        gorduras = float(data.get("gorduras", ""))
        proteinas = float(data.get("proteinas", ""))
        carboidratos = float(data.get("carboidratos", ""))
        foods = data.get("foods","")
        img = data.get("img","")
        name = data.get("name","")
        if not calorias or not gorduras or not proteinas or not carboidratos or not foods or not img or not name:
            return JsonResponse(
            {
            "error": "Todos campos precisam ser preenchidos."
            }, status=400)

        tranlator = Translator()
        translations = tranlator.translate(foods, dest='pt')
        comidas = ''
        for i in range(0,(len(translations))):
            if i == (len(translations)-1):
                comidas += ' e '
            comidas += (translations[i].text)
            if i == (len(translations)-1):
                comidas += '.'
            elif i != (len(translations)-2):
                comidas += ', '
        recipe = receita.objects.create(name = name, img = img, ingredientes = comidas, calorias = calorias, carboidratos = carboidratos, proteinas = proteinas, gorduras = gorduras, timestamp = datetime.timestamp(datetime.now()))
        recipe.save()
        return JsonResponse(
            {
            "mensagem": "A receita foi adicionada com sucesso."
            }, status=200)
    else:
        if request.user.username == "Admin" and request.user.id == 1:
            return render(request, "decidir/recipe.html")
        else:
            return HttpResponseRedirect(reverse("index"))
@csrf_exempt
def tradutor(request):
    if request.method == 'POST':
        tranlator = Translator()
        data = json.loads(request.body)
        translate = data.get("traduzir","")
        translations = tranlator.translate(translate, dest='en')

        return JsonResponse({"traducao":translations.text}, status=200)

    return HttpResponse(401)

@csrf_exempt
def likes(request):
    if request.user.id is None:
        return HttpResponse(401)
    data = json.loads(request.body)
    user = request.user
    recipe_id = int(data.get("id",""))
    recipe = receita.objects.get(pk=recipe_id)
    if request.method == "POST":
        if user in recipe.likes.all():
            recipe.likes.remove(user)
            return JsonResponse({'receita_id': recipe_id}, status=202)
        else:
            recipe.likes.add(user)
            return JsonResponse({'receita_id': recipe_id}, status=202)
    return HttpResponse(401)