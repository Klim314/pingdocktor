from django.urls import path
from . import views

urlpatterns = [
    path("visitor/", views.Visitor.as_view(), name="visitor"),
    path("doctor/", views.Doctor.as_view(), name="doctor"),
    path("update/", views.Update.as_view(), name="update")
]