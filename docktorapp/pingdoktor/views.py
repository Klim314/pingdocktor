from django.shortcuts import render, HttpResponse
from django.views import View
from . import services, models
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

import json
import logging


class Visitor(View):
    def get(self, request):
        """Display for the Visitor side
        """
        # revive from previous_state
        current_visitors = services.get_current_visitors()
        context = {"current_visitors": current_visitors}
        return render(request, "pingdoktor/visitor_home.html",
                      context=context)

    def post(self, request):
        """Receives a post request containing visitor information form data.
        Visitor information is then saved and signals set to websocket connections
        """
        # Extract parameters
        params = request.POST
        first_name = params["first_name"]
        last_name = params["last_name"]
        description = params["description"]
        # print(first_name, last_name, description)
        # Validate and create visitor
        visitor = services.add_visitor(first_name, last_name, description)
        """Update the doctor and inform doctor views to add the user to the waitlist
        Currently implemented for single doctor. For multi-doctor system, all doctors
        on same channel all will gain the visitor added
        """

        async_to_sync(get_channel_layer().group_send)("doctor", {"type": "doctor", "id": visitor.id})
        return HttpResponse(json.dumps({
            "visitor_data": {"first_name": visitor.first_name,
                             "last_name": visitor.last_name,
                             "description": visitor.description,
                             "id": visitor.id}}))


class Doctor(View):
    """Handles the doctor's side the display
    """

    def get(self, request):
        context = {"visitors": services.get_current_visitors()}
        # print(context["visitors"][0].arrival_time)
        return render(request, "pingdoktor/doctor_home.html",
                      context=context)

    def post(self, request):
        """Post query from doctor side retrieving information on a visitor
        request contains a single field "id" with the id of the visitor
        @returns
            Httpresponse with json containing visitor data and visitor parameters for updating the display
        """
        print("POST", request.POST)
        visitor_id = request.POST["id"]
        visitor = models.Visitor.objects.get(id=visitor_id)
        return HttpResponse(json.dumps({
            "visitor_data": {"first_name": visitor.first_name,
                             "last_name": visitor.last_name,
                             "description": visitor.description,
                             "id": visitor.id,
                             "datetime_string": visitor.arrival_time.strftime("%H:%M %d %b %Y")}}))


class Update(View):
    """Handles updating of the seen visitors
    """

    def post(self, request):
        logging.debug("POST: ".format(request.POST))
        visitor_id = request.POST["id"]
        visitor = models.Visitor.objects.get(id=visitor_id)
        services.acknowledge_visitor(visitor)
        return HttpResponse(f"Updated visitor with id {visitor_id}")
