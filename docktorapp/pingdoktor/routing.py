from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/pingdoktor/doctor/", consumers.DoctorConsumer),
    path("ws/pingdoktor/visitor/", consumers.VisitorConsumer)
]