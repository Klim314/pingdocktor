FROM python:3
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code
RUN python manage.py migrate
RUN rm docktorapp/settings.py
RUN mc docktorapp/settings_deploy.py docktorapp/settings.py
