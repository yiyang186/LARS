from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers
import json

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
        result['pyramid_vrtg'] = helpers.get_pyramid_vrtg()
        context = {'title': '重着陆地图', \
                   'alldata': json.dumps(result)}
        return render(request, 'hardlanding/map.html', context)

def show_kline(request):
    if request.GET:
        city = request.GET['city']
        vrtg = float(request.GET['vrtg'])
        print(city, vrtg)
        counts = helpers.get_kline_counts(vrtg=vrtg, city=city)
        res = {'title': '{0}重着陆(>{1})发生频率'.format(city, vrtg), 'counts': counts}
        for span in list('DWMQ'):
            res['data'+span] = helpers.get_kline(vrtg=vrtg, span=span, city=city)
        for window in [100, 500, 1000]:
            res['data'+str(window)] = helpers.get_kline_ma(vrtg=vrtg, window=window, city=city)
        return JsonResponse(res)
    else:
        dates = helpers.get_date_range('2016-01-01', 380, 'D')
        counts = helpers.get_kline_counts(vrtg=1.4)
        geo = helpers.get_airports()
        pyramid_vrtg = helpers.get_pyramid_vrtg()
        alldata = {'dates': dates, 'counts': counts, 'geo': geo, 'pyramid_vrtg': pyramid_vrtg}
        for span in list('DWMQ'):
            alldata['data'+span] = helpers.get_kline(vrtg=1.4, span=span, city=None)
        for window in [100, 500, 1000]:
            alldata['data'+str(window)] = helpers.get_kline_ma(vrtg=1.4, window=window, city=None)
        context = {'title': '重着陆K线图', 'alldata': json.dumps(alldata)}
        return render(request, 'hardlanding/kline.html', context)
        

