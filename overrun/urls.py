from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^bar$', views.show_bar, name='bar'),
    url(r'^kline$', views.show_kline, name='kline'),
]