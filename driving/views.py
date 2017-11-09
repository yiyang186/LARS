from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers

# Create your views here.
def index(request):
    context = {'title': '驾驶模型', 'data': 'Driver'}
    return render(request, 'driving/index.html', context)