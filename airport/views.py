from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers
import json

def show(request):
    if request.GET:
        month = request.GET.get('month')
        airport = request.GET.get('airport')
        title, data = helpers.get_data_in_month_and_airport(month, airport)
        return JsonResponse({'title': title, 'data': data})
    else:
        result = helpers.get_maxvrtg_in_airports()
        context = {'title': '全国机场重着陆', \
                   'alldata': json.dumps(result)}
        return render(request, 'airport/airport.html', context)