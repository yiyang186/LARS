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

def show_driving_features(request):
    if request.GET:
        obj = request.GET.get('obj') # object
        ftr = request.GET.get('ftr') # feature
        cbt = request.GET.get('cbt') # combination
        span = request.GET.get('span') # frequnt
        low = request.GET.get('low')
        high = request.GET.get('high')
        res = helpers.get_driving_features(obj, ftr, cbt, span, low, high)
        return JsonResponse(res, safe=False)
    else:
        dates = helpers.get_date_range('2016-03-01', '2016-12-02', 'D')
        counts = helpers.get_kline_counts()
        alldata = {'dates': dates, 'counts': counts}
        for span in list('DW'):
            data_temp = helpers.get_kline(span)
            alldata['entropy'+span] = data_temp['entropy']
            alldata['crossrate'+span] = data_temp['crossrate']
        context = {'title': '驾驶行为特征', 'alldata': json.dumps(alldata)}
        return render(request, 'pae/driving_features.html', context)

def show_progress(request):
    res = helpers.get_progress()
    return JsonResponse(res, safe=False)