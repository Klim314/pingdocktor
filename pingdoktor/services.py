from datetime import datetime
from .models import Visitor
from django.core.exceptions import ValidationError


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
    # Validation of all parameters
    if any(not i for i in (first_name, last_name, description)):
        raise ValidationError("Empty form field found", "invalid_input")
    # proper capitalization of names. For consistency, we'll keep them all Upper + lower
    first_name = first_name[0].upper() + first_name[1:].lower()
    last_name = last_name[0].upper() + last_name[1:].lower()
    visitor = Visitor.objects.create(arrival_time=datetime.now(),
                                     first_name=first_name,
                                     last_name=last_name,
                                     description=description)
    return visitor


def acknowledge_visitor(visitor):
    """Updates the visitor object to show that the visitor has been seen by the doctor
    """
    visitor.acknowledged = True
    visitor.acknowledged_time = datetime.now()
    visitor.save()


def get_current_visitors():
    """Returns all visitors that have been registered but not seen
    """
    return Visitor.objects.filter(acknowledged=False).order_by("arrival_time")
