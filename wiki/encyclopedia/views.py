from django.shortcuts import render
from . import util
from random import randint
import markdown2

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def search(request, name):
    if name :
        return render(request,"encyclopedia/pages.html", {
        "entries": markdown2.markdown(util.get_entry(name))
        })
    search = request.GET['q']
    if search:
        try:
            if search in util.list_entries():
                return render(request,"encyclopedia/pages.html", {
                "entries": markdown2.markdown(util.get_entry(search))
            })
        except TypeError:
            return render(request, "encyclopedia/error.html",{
                "text":"The page you are looking for doesn't exist."
            })
    return render(request, "encyclopedia/error.html",{
        "text":"The page you are looking for doesn't exist."
    })

def newpage(request):
    if request.method == "POST":
        if request.POST.get('titleedit', False):
            if not type(util.get_entry(request.POST['titleedit'])) == str:
                return render(request,"encyclopedia/error.html", {
            "text": "The page you are trying to edit doesn't exist."})
            return render(request,"encyclopedia/filecreation.html", {
            "filecontent": util.get_entry(request.POST['titleedit'])
            })
        util.save_entry(request.POST.get('title', False), request.POST.get('content', False))
        return render(request,"encyclopedia/pages.html", {
                "entries": markdown2.markdown(util.get_entry(request.POST.get('title', False)))
            })
    return render(request, "encyclopedia/filecreation.html")
    
def random(request):
    list = util.list_entries()
    number = randint(0, len(list) - 1)
    return render(request,"encyclopedia/pages.html", {
                "entries": markdown2.markdown(util.get_entry(list[number]))
            })