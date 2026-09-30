from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.connection import engine

from app import models

from app.routes import auth
from app.routes import product
from app.routes import cart
from app.routes import order


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="E-Commerce Order Management API",
    description="Backend API for an e-commerce order management system",
    version="1.0.0"
)


# Enable CORS so frontend can communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routes
app.include_router(auth.router)
app.include_router(product.router)
app.include_router(cart.router)
app.include_router(order.router)


# Home / health-check endpoint
@app.get("/")
def root():
    return {
        "message": "E-Commerce Order Management API is running!"
    }