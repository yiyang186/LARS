from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers

# Create your views here.
def index(request):
    if request.GET:
        col = request.GET.get('col')
        print(col)
        data = helpers.show_the_column(col)
        return JsonResponse(data, safe=False)
    else:
        names = helpers.get_column_names()
        context = {'mycolumns': names, 'title': '概况'}
        return render(request, 'hardlanding/index.html', context)

def show_map(request):
    if request.GET:
        month = request.GET.get('month')
        city = request.GET.get('city')
        title, data = helpers.get_data_in_month_and_airport(month, city)
        return JsonResponse({'title': title, 'data': data})
    else:
        months, options = helpers.get_maxvrtg_in_airports()
        context = {'title': '重着陆地图', \
                'mapTitle': '全国主要机场着陆情况', \
                'months': months, \
                'options': options}
        return render(request, 'hardlanding/map.html', context)

        

