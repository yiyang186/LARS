from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^ent_opt$', views.show_ent_opt, name='ent_opt'),
    url(r'^track$', views.show_track, name='track'),
    url(r'^driving_features$', views.show_driving_features, name='driving_features'),
]