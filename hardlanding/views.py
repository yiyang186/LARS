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
        context = {'mycolumns': names, 'title': '重着陆'}
        return render(request, 'hardlanding/index.html', context)

        

