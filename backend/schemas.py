from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    seller_id: int
    title: str
    category: str
    price: float
    condition: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserCreate(BaseModel):
    name: str
    email: str
    college: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ChatCreate(BaseModel):
    product_id: int
    buyer_id: int
    seller_id: int


class MessageCreate(BaseModel):
    sender_id: int
    message: str

class ScamCheckRequest(BaseModel):
    title: str
    description: Optional[str] = None
    price: float

class WishlistCreate(BaseModel):
    user_id: int
    product_id: int