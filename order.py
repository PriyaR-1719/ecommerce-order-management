from pydantic import BaseModel


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str

    model_config = {
        "from_attributes": True
    }