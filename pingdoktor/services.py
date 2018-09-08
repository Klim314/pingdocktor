from datetime import datetime
from .models import Visitor


def add_visitor(first_name,
                last_name,
                description):
    """adds the arrival of visitor and loads it into the database
    @args:
        first_name (str):
        last_name (str):
        description (str):
    @returns
        Visitor Model object for the added visitor
    """
    visitor = Visitor.objects.create(arrival_time=datetime.now(),
                                     first_name=first_name,
                                     last_name=last_name,
                                     description=description)
    return visitor


def ready_visitor(visitor):
    """Pings the doctor
    """
    pass
