from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers
import json

# Create your views here.
def index(request):
    alldata = helpers.get_driving_data()
    context = {'title': '驾驶模型', 'alldata': json.dumps(alldata)}
    return render(request, 'driving/index.html', context)