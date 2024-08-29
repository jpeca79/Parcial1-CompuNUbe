import requests
from flask import Blueprint, request, jsonify, session
from orders.models.order_model import Order
from db.db import db

order_controller = Blueprint('order_controller', __name__)

@order_controller.route('/api/orders', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    result = [
        {
            'id': order.id,
            'userName': order.user_name,
            'userEmail': order.user_email,
            'saleTotal': str(order.saleTotal),
            'date': order.date
        }
        for order in orders
    ]
    return jsonify(result)

@order_controller.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({
        'id': order.id,
        'userName': order.user_name,
        'userEmail': order.user_email,
        'saleTotal': str(order.saleTotal),
        'date': order.date
    })

@order_controller.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    user_name = session.get('username')
    user_email = session.get('email')

    if not user_name or not user_email:
        return jsonify({'message': 'Información de usuario inválida'}), 400

    products = data.get('products')
    if not products or not isinstance(products, list):
        return jsonify({'message': 'Falta o es inválida la información de los productos'}), 400

    total_sale = 0

    for item in products:
        product_id = item.get('product_id')
        quantity = item.get('quantity')

        if not product_id or not quantity:
            return jsonify({'message': 'Información de producto inválida'}), 400

        product = Products.query.get(product_id)
        if not product:
            return jsonify({'message': f'Producto con ID {product_id} no encontrado.'}), 404

        if product.quantity < quantity:
            return jsonify({'message': f'Cantidad no disponible para el producto {product.name}.'}), 400

        # Calcular el total de la venta
        total_sale += product.price * quantity

        # Actualizar el inventario del producto
        product.quantity -= quantity
        db.session.commit()

    # Crear una nueva instancia de Order y guardarla en la base de datos
    new_order = Order(user_name=user_name, user_email=user_email, saleTotal=total_sale)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({'message': 'Orden creada exitosamente'}), 201
