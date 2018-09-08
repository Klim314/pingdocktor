from django.shortcuts import render, HttpResponse
from django.views import View
from . import services, models
import json


class Visitor(View):
    def get(self, request):
        """Display for the Visitor side
        """
        # revive from previous_state
        current_visitors = models.Visitor.objects.filter(acknowledged=False)
        context = {"current_visitors": current_visitors}
        return render(request, "pingdoktor/visitor_home.html",
                      context=context)

    def post(self, request):
        """Receives a post request containing visitor information form data.
        Visitor information is then saved and signals set to websocket connections
        """
        # Extract parameters
        params = request.post
        first_name = params["first_name"]
        last_name = params["last_name"]
        # Validate and create visitor
        services.add_visitor(first_name, last_name, ...)
        return HttpResponse(json.dumps({"message": 1}))


class Doctor(View):
    """Handles the doctor's side the display
    """

    def get(self, request):
        return render(request, "pingdoktor/doctor")
