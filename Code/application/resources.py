from flask_restful import Resource, Api, reqparse, marshal_with, fields, marshal
from .models import *
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .instances import cache

api = Api()


''' ------------ ------------ -------------- Category -------------- ------------- --------------'''


parser = reqparse.RequestParser()
parser.add_argument("c_name", type=str, help='Category should be String')

category_fields = {
  'c_id': fields.Integer,
  'c_name': fields.String,
  'is_approved': fields.Boolean
}

class ApiCategory(Resource):
  @marshal_with(category_fields)
  #@cache.cached(timeout=50)
  def get(self):
    categories = Category.query.all()
    if len(categories) == 0:
      return {"message" : "No categories found"}
    return categories
  
  @jwt_required()
  def post(self):  
    args = parser.parse_args()
    identity = get_jwt_identity()
    is_approved = identity['role'] == 'admin'     
    category = Category(is_approved=is_approved, **args)
    db.session.add(category)
    db.session.commit()
    db.session.commit()
    return {'message': 'Resource created'}
  
  @jwt_required()
  def delete(self, c_id):
    identity = get_jwt_identity()
    if identity['role'] == 'admin':    
      category = Category.query.get(c_id)
      if category is None:
        return {"message": "Category Not found"}
      
      delete_products = Products.query.filter_by(section = category.c_id).all()
      for product in delete_products:
        db.session.delete(product)    
      db.session.delete(category)
      db.session.commit() 
      return {"message": "Category deleted successfully"}
    return {"message": "Not Admin"}  
  
class ApiCategoryList(Resource):

  @marshal_with(category_fields)
  @jwt_required()
  def put(self, c_id):
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
      category = Category.query.get(c_id)
      if category is None:
        return {'message': 'Category Not found'}
      args = parser.parse_args()
      category.c_name = args["c_name"]
      db.session.commit()
      return {'message': 'Category Updated Successfully'}
    return {"message": "Not Admin"} 
  

  @marshal_with(category_fields)
  def get(self, c_id):
    category = Category.query.get(c_id)
    if category is None:
      return {"message": "Category Not found"}
    return category

class ApiApproveCategory(Resource):
  @jwt_required()
  def put(self, c_id):
    identity = get_jwt_identity()
    if identity['role'] == 'admin':
      category = Category.query.get(c_id)
      if category is None:
        return {"message": "Category Not found"}
      category.is_approved = True
      db.session.commit()
      return {"message": "Category Approved Successfully"}
    return {"message": "Not Admin"}


api.add_resource(ApiCategory, "/api/add_category", "/api/categories", "/api/delete_category/<int:c_id>")
api.add_resource(ApiCategoryList, "/api/category/<int:c_id>", "/api/update_category/<int:c_id>")
api.add_resource(ApiApproveCategory, "/api/approve_category/<int:c_id>")


''' ---------------- ------------- -------------- Product ------------- ------------ -------------- '''

p_parser = reqparse.RequestParser()
p_parser.add_argument("p_id", type=int, help='Id should be Integer')
p_parser.add_argument("p_name", type=str, help='Name should be String')
p_parser.add_argument("mfd", type=str, help='Date should be String')
p_parser.add_argument("rate", type=int, help='Rate should be Integer')
p_parser.add_argument("unit",type=str, help='Unit should be String')
p_parser.add_argument("stock", type=int, help='Stock should be Integer')
p_parser.add_argument("section")


product_fields = {
  'p_id': fields.Integer, 
  'p_name': fields.String,
  'mfd': fields.String,
  'rate': fields.Integer,
  'unit': fields.String,
  'stock': fields.Integer,
  'section': fields.Integer
}

class ApiProduct(Resource):
  @marshal_with(product_fields)
  #@cache.cached(timeout=50)
  def get(self, c_id):      
    products = Products.query.filter_by(section=c_id).all()
    if products == []:
      return {"message": "No Products found for this category"}
                
    return products

  @marshal_with(product_fields)
  @jwt_required()
  def post(self, c_id):    
    identity = get_jwt_identity()
    if identity['role'] == 'manager':    
      category = Category.query.get(c_id)

      if category:
    
        data = p_parser.parse_args()
        p_id = data['p_id']
        p_name = data['p_name']
        mfd = data['mfd']
        rate = data['rate']
        unit = data['unit']
        stock = data['stock']
        section = data['section']
        product = Products(p_id=p_id, p_name = p_name, mfd = mfd, rate = rate, unit=unit, stock = stock, section=section)
        db.session.add(product)
        db.session.commit()
        return jsonify({"message": "Product Added Successfully"})
      return {"message": "Category not found"}
    return {"message": "Not Manager"}
  

  @marshal_with(product_fields)
  @jwt_required()
  def put(self, p_id):
    identity = get_jwt_identity()
    if identity['role'] == 'manager':
      product = Products.query.get(p_id)    
      data = p_parser.parse_args()    
      if product:
        product.p_name = data["p_name"]
        product.mfd = data["mfd"]
        product.unit = data["unit"]
        product.rate = data["rate"]
        product.stock = data["stock"]
        product.section = data["section"]
        db.session.commit()
        return {"message" : "Product Updated Successfully"}
      return {"message" : "Product Not found"}
    return {"message": "Not Manager"}
  
  @jwt_required()
  def delete(self, p_id):
    identity = get_jwt_identity()
    if identity['role'] == 'manager':
      product = Products.query.get(p_id)
      if product:
        db.session.delete(product)
        db.session.commit()
        return {"message": "Product Deleted Successfully"}
      return {"message" : "Product Not found"}
    return {"message": "Not Manager"}

api.add_resource(ApiProduct, "/api/add_product/<int:c_id>", "/api/products/<int:c_id>", "/api/update_product/<int:p_id>")


class ApiAllProducts(Resource):
  @marshal_with(product_fields)
  def get(self):
    products = Products.query.all()
    if products == []:
      return {"message": "No Products found"}
    return products

api.add_resource(ApiAllProducts, "/api/all_products")

class ApiProductById(Resource):
  @marshal_with(product_fields)
  def get(self, p_id):
    product = Products.query.get(p_id)
    if product is None:
      return {"message": "Product Not found"}
    return product

api.add_resource(ApiProductById, "/api/product/<int:p_id>")


''' ---------------- ------------- -------------- Cart ------------- ------------ -------------- '''

cart_parser = reqparse.RequestParser()
cart_parser.add_argument("u_id", type=int, required=True, help="User ID is required")
cart_parser.add_argument("p_id", type=int, required=True, help="Product ID is required")
cart_parser.add_argument("quantity", type=int, required=True, help="Quantity is required")
cart_parser.add_argument("price", type=int, required=True, help="Price is required")
cart_parser.add_argument("total", type=int, required=True, help="Total is required")


cart_fields = {
    'u_id': fields.Integer,
    'p_id': fields.Integer,
    'quantity': fields.Integer,
    'price': fields.Integer,
    'total': fields.Integer
}

class ApiCart(Resource):
  @jwt_required()  
  def get(self, u_id):
    identity = get_jwt_identity()
    if identity['role'] == 'customer':
      cart = Cart.query.filter_by(u_id=identity['id']).all()
      products = Products.query.all()
    
      cart = marshal(cart, cart_fields)
      products = marshal(products, product_fields)
      return {
        'cart': cart,
        'products': products}       
      
    return {"message": "Not Customer"}
  
  @marshal_with(cart_fields)
  @jwt_required()
  def post(self):
    identity = get_jwt_identity()
    if identity['role'] == 'customer':
      data = cart_parser.parse_args()
      if data['quantity'] <= 0:
        return {"message": "Quantity should be greater than 0"}, 400
      product = Products.query.get(data['p_id'])
      if product.stock < data['quantity']:
        return {"message": "Product out of stock"}
      cart_items = Cart(**data)
      db.session.add(cart_items)
      db.session.commit()
      return {"message": "Product added to cart successfully"}
    return {"message": "Not Customer"}
  
  @marshal_with(cart_fields)
  @jwt_required()
  def put(self, p_id):
    identity = get_jwt_identity()
    if identity['role'] == 'customer':
      args = cart_parser.parse_args()
      product = Products.query.get(args['p_id'])
      cart_item = Cart.query.filter_by(u_id=identity['id'], p_id=p_id).first()
      if not cart_item:
        return {"message": "Cart item not found"}, 404
      if product.stock < args['quantity']:
        return {"message": "Not enough stock available"}
      product.stock -= args['quantity'] - cart_item.quantity 
      cart_item.quantity = args["quantity"]
      cart_item.price = args["price"]
      cart_item.total = args["total"]
      db.session.commit()
      return cart_item
    return {"message": "Not Customer"}

  @jwt_required() 
  def delete(self, p_id):
    identity = get_jwt_identity()
    if identity['role'] == 'customer':
      cart_item = Cart.query.filter_by(u_id=identity['id'], p_id=p_id).first()
      if not cart_item:
        return {"message": "Cart item not found"}, 404
      db.session.delete(cart_item)
      db.session.commit()
      return {"message": "Cart item deleted successfully"}
    return {"message": "Not Customer"}

api.add_resource(ApiCart, "/api/cart/<int:u_id>", "/api/add_to_cart", "/api/update_cart/<int:p_id>")


''' ----------- -------------- ------------ ------ Checkout  ------------ ------------- --------- --------'''

class ApiCheckout(Resource):
  def post(self, u_id):
    cart = Cart.query.filter_by(u_id=u_id).all()
    if not cart:
      return {"message": "No cart items found for this user"}
    
    for item in cart:
      product = Products.query.get(item.p_id)
      if product:
        product.stock = product.stock - item.quantity

      db.session.delete(item)
      db.session.commit()
    
    return {"message": "Checkout Successful"}

api.add_resource(ApiCheckout, "/api/checkout/<int:u_id>")


''' ---------------- ------------- -------------- Search ------------- ------------ -------------- '''
'''
search_parser = reqparse.RequestParser()
search_parser.add_argument('q', type=str, required=True, help="Query parameter is required")

class ApiSearch(Resource):
    @marshal_with({'product': fields.List(fields.Nested(product_fields)), 
                   'category': fields.List(fields.Nested(category_fields)),
                   'price': fields.List(fields.Nested(product_fields)),
                   'date': fields.List(fields.Nested(product_fields))})
    def get(self):
        args = search_parser.parse_args()
        query = '%' + args['q'] + '%'
        product = Products.query.filter(Products.p_name.like(query)).all()
        category = Category.query.filter(Category.c_name.like(query)).all()
        price = Products.query.filter(Products.rate.like(query)).all()
        date = Products.query.filter(Products.mfd.like(query)).all()

        return {'product': product, 'category': category, 'price': price, 'date': date}
    
api.add_resource(ApiSearch, "/api/search")
'''
