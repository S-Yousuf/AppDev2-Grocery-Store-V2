from app import app
from application.models import db, Role, User, Admin
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    customer = Role(id='1', name='Customer', description="Customer description")
    db.session.add(customer)
    
    store_manager = Role(id='2', name='Store Manager', description="Manager")
    db.session.add(store_manager)

    db.session.commit()

    admin = Admin.query.filter_by(username='Admin').first()
    if not admin:
        admin = Admin(id='1', username = "Admin", password=generate_password_hash("Password"))
        db.session.add(admin)
        db.session.commit()


