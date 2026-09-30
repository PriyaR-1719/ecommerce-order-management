from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.product import Product


def add_to_cart(
    db: Session,
    user_id: int,
    product_id: int,
    quantity: int
):
    if quantity <= 0:
        return None, "Quantity must be greater than zero"

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None, "Product not found"

    if product.stock < quantity:
        return None, "Insufficient stock"

    existing_item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == product_id
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + quantity

        if new_quantity > product.stock:
            return None, "Requested quantity exceeds available stock"

        existing_item.quantity = new_quantity

        db.commit()
        db.refresh(existing_item)

        return existing_item, None

    cart_item = CartItem(
        user_id=user_id,
        product_id=product_id,
        quantity=quantity
    )

    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    return cart_item, None


def get_user_cart(
    db: Session,
    user_id: int
):
    return db.query(CartItem).filter(
        CartItem.user_id == user_id
    ).all()