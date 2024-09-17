from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    is_approved = db.Column(db.Boolean(), default=True)
        
  
class RoleUsers(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))               

class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True, autoincrement= True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean(), default=False)
    is_approved = db.Column(db.Boolean(), default=False)  
    roles = db.relationship('Role', secondary='role_users', backref=db.backref('users', lazy='dynamic'))
    cart = db.relationship('Cart', backref = 'user', uselist = True)

    def __repr__(self):
        return f"<User {self.name}>"
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    @classmethod
    def get_user_by_username(cls, username):
        return cls.query.filter_by(username = username).first()



class Role(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), unique=True)
    description = db.Column(db.String(200))


class Category(db.Model):
    c_id = db.Column(db.Integer(), primary_key=True, autoincrement= True)
    c_name = db.Column(db.String(50), nullable=False)
    relation = db.relationship('Products', backref='item')
    is_approved = db.Column(db.Boolean(), default=False)

    def __repr__(self):
        return f"{self.c_name}"
  

class Products(db.Model):
    p_id = db.Column(db.Integer(), primary_key=True, autoincrement= True)
    p_name = db.Column(db.String(50), nullable=False)
    mfd = db.Column(db.String(10)) 
    unit = db.Column(db.String(50), nullable=False)
    rate = db.Column(db.Integer(), nullable=False)
    stock = db.Column(db.Integer(), nullable=False)
    section = db.Column(db.Integer(), db.ForeignKey("category.c_id"))
    is_approved = db.Column(db.Boolean(), default=False)

    def __repr__(self):
        return f"{self.p_name}"


class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    u_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    p_id = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer())
    price = db.Column(db.Integer)
    total = db.Column(db.Integer)



    

'''
flask:
define route  --> define method  --> define functionality

api:
define method --> functionality --> define route

'''