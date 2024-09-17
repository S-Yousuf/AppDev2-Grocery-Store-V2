from functools import wraps
from flask_jwt_extended import get_jwt, jwt_required

def admin_required(fn):
    @wraps(fn)
    @jwt_required
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') == 'admin':
            return fn(*args, **kwargs)
        return {"message": "Admins only!"}, 403
    return wrapper

def manager_required(fn):
    @wraps(fn)
    @jwt_required
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') == 'manager':
            return fn(*args, **kwargs)
        return {"message": "Store Managers only!"}, 403
    return wrapper

def customer_required(fn):
    @wraps(fn)
    @jwt_required
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get('role') == 'customer':
            return fn(*args, **kwargs)
        return {"message": "Customers only!"}, 403
    return wrapper