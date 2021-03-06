"""LRAS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^hardlanding/', include('hardlanding.urls', namespace='hardlanding')),
    url(r'^airport/', include('airport.urls', namespace='airport')),
    url(r'^pae/', include('pae.urls', namespace='pae')),
    url(r'^driving/', include('driving.urls', namespace='driving')),
    url(r'^overrun/', include('overrun.urls', namespace='overrun')),
    url(r'^index/', include('index.urls', namespace='index')),
]
