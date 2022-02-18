from django.shortcuts import render
import datetime

def index(request):
    now = datetime.datetime.now()
    if now.day == 1 and now.month == 1:
        newyear = "Yes"
    else:
        newyear = "No"
    return render(request,"newyear/index.html",{
        "newyear": newyear
    })
