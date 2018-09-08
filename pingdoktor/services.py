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
    # proper capitalization of names. For consistency, we'll keep them all Upper + lower
    first_name = first_name[0].upper() + first_name[1:].lower()
    last_name = last_name[0].upper() + last_name[1:].lower()
    visitor = Visitor.objects.create(arrival_time=datetime.now(),
                                     first_name=first_name,
                                     last_name=last_name,
                                     description=description)
    return visitor


def ready_visitor(visitor):
    """Pings the doctor
    """
    pass
