from django.test import TestCase
from django.core.exceptions import ValidationError
from pingdoktor.models import Visitor
from pingdoktor import services
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

    def test_incomplete_add_1(self):
        """Blank fields are not permitted. Attempting to add a blank field should raise
        a validation error
        """
        with self.assertRaises(ValidationError):
            services.add_visitor("Terrence", "Smith", description="")

    def test_acknowledge(self):
        """Tests the acknowledgement function
        """
        visitor = Visitor.objects.get(id=1)
        services.acknowledge_visitor(visitor)
        visitor = Visitor.objects.get(id=1)
        assert(visitor.acknowledged is True)

    def test_get_currrent_visitors(self):
        """Tests the get_current_visitors service which returns all visitors in the wait list
        Upon acknowledgement, visitors returned should decrease"""
        visitors = services.get_current_visitors()
        assert(len(visitors) == 2)
        services.acknowledge_visitor(visitors[0])
        visitors = services.get_current_visitors()
        assert(len(visitors) == 1)
