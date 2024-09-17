from flask import Flask, jsonify
from application.models import db, User, jwt
from config import DevelopmetConfig
from application.resources import api
from flask_cors import CORS
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder
from application.instances import cache


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmetConfig)
    CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE"]}})
  
    # Initializing Extensions

    db.init_app(app)
    api.init_app(app)
    jwt.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)

    with app.app_context():
        import application.views
        return app
    

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=18, minute=30, day_of_month=1), daily_reminder.s('yousuf@email.com','test' )),


if __name__ == '__main__':
    app.run(debug=True)

