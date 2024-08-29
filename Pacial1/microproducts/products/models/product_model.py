from db.db import db

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)  # Cambié 'stock' por 'quantity'

    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity
