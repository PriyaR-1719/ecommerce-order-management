from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate


# =========================
# CREATE PRODUCT
# =========================

def create_product(
    db: Session,
    product_data: ProductCreate
):
    product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock=product_data.stock,
        image_url=product_data.image_url
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


# =========================
# GET ALL PRODUCTS
# =========================

def get_products(
    db: Session
):
    return db.query(Product).all()


# =========================
# GET SINGLE PRODUCT
# =========================

def get_product(
    db: Session,
    product_id: int
):
    return db.query(Product).filter(
        Product.id == product_id
    ).first()


# =========================
# UPDATE PRODUCT
# =========================

def update_product(
    db: Session,
    product_id: int,
    product_data: ProductCreate
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        return None

    product.name = product_data.name
    product.description = product_data.description
    product.price = product_data.price
    product.stock = product_data.stock
    product.image_url = product_data.image_url

    db.commit()
    db.refresh(product)

    return product