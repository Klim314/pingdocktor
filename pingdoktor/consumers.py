from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
import logging


class DoctorConsumer(WebsocketConsumer):
    """Handles websocket input from the Doctor side input. I.e. handles the case of a doctor selecting a patient
    """

    def connect(self, *args, **kwargs):
        # Handles the websocket connection
        # Single group to handle it all
        self.group_name = "doctor"
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        logging.debug(f"Recieved text data: {text_data}, bytes_data: {bytes_data}")
        data = json.loads(text_data)
        message = data["message"]
        # Handle data going to visitors
        if message["type"] == "visitor":
            async_to_sync(self.channel_layer.group_send)("visitor",
                                                         message)

    def doctor(self, event):
        """Handler for doctor typed events passed throught the channel"""
        logging.debug(f"Recieved event {event}")
        self.send(text_data=json.dumps(event))


class VisitorConsumer(WebsocketConsumer):
    """Websocket consumer for the visitor client
    """

    def connect(self, *args, **kwargs):
        # Handles the websocket connection
        # Single group to handle it all
        self.group_name = "visitor"
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data=None, bytes_data=None):
        """Recieves a signal from the visitor socket. Not really needed, but implemented in case
        """
        logging.debug(f"Recieved text data: {text_data}, bytes_data: {bytes_data}")
        data = json.loads(text_data)

    def visitor(self, event):
        """Handler for visitor typed events passed throught the channel"""
        logging.debug(f"Recieved event {event}")
        # Send the event to the websocket and get the client-page to handle it
        self.send(json.dumps(event))
