from django.urls import path
from . import views

urlpatterns = [
    path("visitor/", views.Visitor.as_view(), name="visitor"),
    path(r"doctor/<int:doctor_id>", views.Doctor.as_view())
]