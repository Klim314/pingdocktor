from django.db import models

# Create your models here.


class Visitor(models.Model):
    """Information on a specific visitor
    @params
        arrival (datetime): datetime of patient registration
        acknowledged (bool): Has the patient been marked by the doctor for consultation?
        first_name (char): First name of patient
        last_name (char): Last name of patient
        description (text): Description of patient condition
    """
    arrival_time = models.DateTimeField()
    acknowledged = models.BooleanField(default=False, db_index=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    description = models.TextField()
