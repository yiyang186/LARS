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
    data = helpers.get_maxvrtg_in_airports()
    context = {'title': '重着陆地图', 'map_title': '全国主要机场着陆情况', "data": data}
    return render(request, 'hardlanding/map.html', context)

        

