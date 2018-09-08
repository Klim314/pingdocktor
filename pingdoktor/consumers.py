from channels.generic.websocket import WebsocketConsumer


class DoctorConsumer(WebsocketConsumer):
    """Handles websocket input from the Doctor side input. I.e. handles the case of a doctor selecting a patient
    """

    def connect(self, *args, **kwargs):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        pass
