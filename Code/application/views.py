from flask import current_app as app, jsonify, request, render_template, send_file
from .models import *

from flask_cors import cross_origin
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from celery.result import AsyncResult
from flask_restful import marshal, fields
import flask_excel as excel  
from .tasks import create_resource_csv

''' --------- ---------- ---------- ------- Products ---------- ------------ ------------ ------''' 



@app.get('/')
def home():
    return render_template('index.html')


''' --------- ---------- ---------- ------- User ---------- ------------ ------------ ------'''

@app.post('/user-register')
def register_user():
    data = request.get_json()

    user = User.get_user_by_username(username = data.get('username'))

    if user is not None:
        return jsonify({"error": "user already exists"}), 409
    
    new_user = User(
        name = data.get('name'),
        username = data.get('username')
    )
    new_user.set_password(password = data.get('password'))
    db.session.add(new_user)
    db.session.commit()        
    return jsonify({"message": "User Created"}), 201

@app.post('/user-login')
def user_login():
    data = request.get_json()

    user = User.get_user_by_username(username = data.get('username'))
    if user and check_password_hash(user.password, data.get("password")):
        access_token = create_access_token(identity={'id': user.id, 'username' : user.username, 'role': 'customer'})
        return jsonify(
            {
                "message":"Logged in",
                "token": access_token,
                "user_id": user.id
            }
        ), 200
    
    return jsonify({"error":"Invalid username or Password"}), 400

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'username': fields.String,
    'active': fields.Boolean,
    'is_approved': fields.Boolean
}


@app.get('/users')
@jwt_required()
def get_users():
    current_user = get_jwt_identity().get('role')
    if current_user ==  'admin':

        users = User.query.all()
        if len(users) == 0:
            print(users)
            return jsonify({"message": "No users found"}), 404
        return jsonify({"users": marshal(users, user_fields)}), 200


''' ------- --------- --------- ------------ Admin --------- ---------- -------- ------------- '''


@app.post('/manager-login')
@cross_origin()
def admin_login():
    data = request.get_json()
    admin = Admin.query.filter_by(username=data.get('username')).first()
    user = User.query.filter_by(username=data.get('username')).first()
    if admin and check_password_hash(admin.password, data.get("password")):
        print(admin.username)
        access_token = create_access_token(identity={'id' : admin.id,'username': admin.username, 'role': 'admin'})
        
        return jsonify(
            {
                "message":"Logged in",
                "token": access_token
                
            }
        ), 200
    if user and check_password_hash(user.password, data.get("password")) and user.is_approved:
        print(user.username)
        access_token = create_access_token(identity={'id': user.id, 'username' : user.username, 'role': 'manager'})
        return jsonify(
            {
                "message":"Logged in",
                "token": access_token                    
            }
        ), 200
    return jsonify({"error":"Invalid username or Password"}), 400


''' ---------- ----------  ------ --------- Store Manager ---------- -------- --------- ------ ------ '''

@app.post('/admin/approve/store-manager/<int:user_id>')
def approve_store_manager(user_id):

    user = User.query.get(user_id)
    if user:
        user.is_approved = True
        db.session.commit()

        return jsonify({"message": "Store Manager Approved"}), 200
    return jsonify({"error": "User not found"}), 404



@app.get('/download-csv')
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task_id": task.id}), 200

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    task = AsyncResult(task_id)
    if task.ready():
        filename = task.result()
        return send_file(filename, as_attachment=True)
    return jsonify({"message": "Task is still running"}), 202