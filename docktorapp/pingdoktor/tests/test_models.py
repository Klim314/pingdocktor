from django.test import TestCase
from pingdoktor.models import Visitor
from datetime import datetime


class TestVisitorModel(TestCase):
    def setUp(self):
        Visitor.objects.create(arrival_time=datetime(2014, 8, 4, 22, 11),
                               first_name="Bob",
                               last_name="Smith",
                               description="sick")

        Visitor.objects.create(arrival_time=datetime(2014, 8, 4, 23, 11),
                               first_name="Lisa",
                               last_name="Smith",
                               description="sick")

    def test_trivial_get(self):
        visitor = Visitor.objects.filter(last_name="Smith",
                                         first_name="Bob")
        assert(len(visitor) == 1)
