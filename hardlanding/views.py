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
        airport = request.GET.get('airport')
        title, data = helpers.get_data_in_month_and_airport(month, airport)
        return JsonResponse({'title': title, 'data': data})
    else:
        result = helpers.get_maxvrtg_in_airports()
        context = {'title': '重着陆分布图', \
                   'alldata': json.dumps(result)}
        return render(request, 'hardlanding/map.html', context)

def show_kline(request):
    if request.GET:
        airport = request.GET.get('airport')
        airports = request.GET.get('airport_codes')
        
        if airport:    
            if airport == 'null':
                airport = None
                chinese_airport = '全国'
            else:
                chinese_airport = helpers.get_chinese_airport_name(airport)
        if airports:
            airport = airports[1: -1].split(',')
            chinese_airport = request.GET.get('title')
        vrtg = float(request.GET['vrtg'])
        counts = helpers.get_kline_counts(vrtg=vrtg, airport=airport)
        res = {'title': '{0}机场重着陆(>{1})发生频率'.format(chinese_airport, vrtg), 'counts': counts}
        for span in list('DW'):
            data_temp = helpers.get_kline(vrtg=vrtg, span=span, airport=airport)
            res['data'+span] = data_temp['vrtgp']
            res['entropy'+span] = data_temp['entropy']
            res['crossrate'+span] = data_temp['crossrate']
        # for window in [500]:
        #     res['data'+str(window)] = helpers.get_kline_ma(vrtg=vrtg, window=window, airport=airport)
        return JsonResponse(res)
    else:
        dates = helpers.get_date_range('2016-01-01', 380, 'D')
        counts = helpers.get_kline_counts(vrtg=1.4)
        geo = helpers.get_airports()
        pyramid_vrtg = helpers.get_pyramid_vrtg()
        alldata = {'dates': dates, 'counts': counts, 'airportinfo': geo['info'], 
            'altitude': geo['altitude'], 'length': geo['length'],  'pyramid_vrtg': pyramid_vrtg}
        for span in list('DW'):
            data_temp = helpers.get_kline(vrtg=1.4, span=span, airport=None)
            alldata['data'+span] = data_temp['vrtgp']
            alldata['entropy'+span] = data_temp['entropy']
            alldata['crossrate'+span] = data_temp['crossrate']
        # for window in [500]:
        #     alldata['data'+str(window)] = helpers.get_kline_ma(vrtg=1.4, window=window, airport=None)
        context = {'title': '重着陆趋势图', 'alldata': json.dumps(alldata)}
        return render(request, 'hardlanding/kline.html', context)
        
def show_overrun_bar(request):
    context = {'title': '冲出跑道分布'}
    return render(request, 'hardlanding/overrun_bar.html', context)

def show_overrun_kline(request):
    context = {'title': '冲出跑道趋势'}
    return render(request, 'hardlanding/overrun_kline.html', context)