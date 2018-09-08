from django.shortcuts import render, HttpResponse
from django.views import View
from . import services, models
import json


class Visitor(View):
    def get(self, request):
        """Display for the Visitor side
        """
        # revive from previous_state
        current_visitors = models.Visitor.objects.filter(acknowledged=False).order_by("arrival_time")
        context = {"current_visitors": current_visitors}
        return render(request, "pingdoktor/visitor_home.html",
                      context=context)

    def post(self, request):
        """Receives a post request containing visitor information form data.
        Visitor information is then saved and signals set to websocket connections
        """
        # Extract parameters
        params = request.POST
        print(params)
        first_name = params["first_name"]
        last_name = params["last_name"]
        description = params["description"]
        print(first_name, last_name, description)
        # Validate and create visitor
        visitor = services.add_visitor(first_name, last_name, description)
        return HttpResponse(json.dumps({
            "visitor_data": {"first_name": visitor.first_name,
                             "last_name": visitor.last_name,
                             "id": visitor.id}}))


class Doctor(View):
    """Handles the doctor's side the display
    """

    def get(self, request):
        return render(request, "pingdoktor/doctor")
