from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers
import json

def show_ent_opt(request):
    alldata = helpers.get_all_airports_ent_opt()
    context = {'title': '所有机场的环境熵与逆转率', 'alldata': json.dumps(alldata)}
    return render(request, 'pae/ent_opt.html', context)

def show_track(request):
    alldata = helpers.get_ent_opt_track()
    context = {'title': '所有机场的环境熵与逆转率质心轨迹', 'alldata': json.dumps(alldata)}
    return render(request, 'pae/track.html', context)