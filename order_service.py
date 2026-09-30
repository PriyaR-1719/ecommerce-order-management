from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.order import Order
from app.models.product import Product


def create_order(
    db: Session,
    user_id: int
):
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == user_id
    ).all()

    if not cart_items:
        return None, "Cart is empty"

    total_amount = 0.0
    products = []

    for item in cart_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product is None:
            return None, "Product not found"

        if product.stock < item.quantity:
            return None, (
                f"Insufficient stock for {product.name}"
            )

        total_amount += product.price * item.quantity

        products.append((product, item.quantity))

    order = Order(
        user_id=user_id,
        total_amount=total_amount,
        status="PLACED"
    )

    db.add(order)

    for product, quantity in products:
        product.stock -= quantity

    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(order)

    return order, None


def get_user_orders(
    db: Session,
    user_id: int
):
    return db.query(Order).filter(
        Order.user_id == user_id
    ).all()