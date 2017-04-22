from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers
import json

# Create your views here.
def show_bar(request):
    data = helpers.get_overrun_data()
    context = {'title': '冲出跑道分布', 'data': data}
    return render(request, 'overrun/bar.html', context)

def show_kline(request):
    data = helpers.get_overrun_data()
    context = {'title': '冲出跑道趋势', 'data': data}
    return render(request, 'overrun/kline.html', context)