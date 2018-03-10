from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from . import helpers
import json

# Create your views here.
def index(request):
    if request.GET:
        filename = request.GET.get('filename')
        alldata = helpers.get_driving_data(filename)
        if request.GET.get('json') == 'yes':
            return JsonResponse(alldata, safe=False)
        else:
            context = {'title': '驾驶模型', 'alldata': json.dumps(alldata), 
                       'files': helpers.files, 'row1': list(range(1, 7)), 'row2': list(range(7, 12))}
            return render(request, 'driving/index.html', context)
    else:
        alldata = helpers.get_driving_data()
        context = {'title': '驾驶模型', 'alldata': json.dumps(alldata), 
        'files': helpers.files, 'row1': list(range(1, 7)), 'row2': list(range(7, 12))}
        return render(request, 'driving/index.html', context)
        