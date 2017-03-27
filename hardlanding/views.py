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
        result = helpers.get_maxvrtg_in_airports('world')
        context = {'title': '重着陆地图', \
                   'alldata': result}
        return render(request, 'hardlanding/map.html', context)

def show_kline(request):
    if request.GET:
        month = request.GET.get('month')
        city = request.GET.get('city')
        title, data = helpers.get_data_in_month_and_airport(month, city)
        return JsonResponse({'title': title, 'data': data})
    else:
        dates = helpers.get_date_range('2016-01-01', 380, 'D')
        counts = helpers.get_kline_counts(vrtg=1.4)
        context = {'title': '重着陆K线图','dates': dates, 'counts': counts}
        for span in list('DWMQ'):
            context['data_'+span] = helpers.get_kline(vrtg=1.4, span=span)
        return render(request, 'hardlanding/kline.html', context)
        

