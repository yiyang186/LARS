from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^map', views.show_map, name='map'),
    url(r'^kline', views.show_kline, name='kline'),
    url(r'^overrunbar', views.show_overrun_bar, name='overrun_bar'),
    url(r'^overrunkline', views.show_overrun_kline, name='overrun_kline'),
]