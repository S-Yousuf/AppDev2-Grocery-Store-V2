from celery import shared_task
from .models import Products
import flask_excel as excel
from .mail_service import send_message
from .models import User
from jinja2 import Template

@shared_task(ignore_result=False)
def create_resource_csv():
    product = Products.query.with_entities(Products.p_id, Products.p_name, Products.rate).all()
    
    csv_output = excel.make_response_from_query_sets(product, ["p_id", "p_name", "rate"], "csv")
    filename = "products.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)
    
    return filename


@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.all()
    for user in users:
        send_message(user.username, subject, "hello!, We see you have not ordered anything today. Please visit our website and order something.")
    return "ok"


'''
@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.all()
    for user in users:
        with open('test.html', 'r') as f:
            template = Template(f.read())
            #template.render(name=user.name)
            send_message(users.email, subject, template.render())
    return "ok"

'''
