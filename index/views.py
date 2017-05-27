from django.shortcuts import render

# Create your views here.
def index(request):
    context = {'title': '概况'}
    return render(request, 'index/index.html', context)