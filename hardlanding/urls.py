from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^map', views.show_map, name='map'),
    url(r'^kline', views.show_kline, name='kline'),
]