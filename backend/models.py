from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    college = Column(String(150), nullable=False)
    verified = Column(Boolean, default=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    condition = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(20), nullable=False, default="active")

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    buyer_id = Column(Integer, nullable=False)
    seller_id = Column(Integer, nullable=False)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, nullable=False)
    sender_id = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, nullable=False, index=True)
    from_location = Column(String(200), nullable=False)
    to_location = Column(String(200), nullable=False)
    date = Column(String(50), nullable=False)
    departure_time = Column(String(20), nullable=False)
    price = Column(Float, nullable=False)
    total_seats = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    vehicle_info = Column(String(250), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class RideRequest(Base):
    __tablename__ = "ride_requests"
    __table_args__ = (UniqueConstraint("ride_id", "requester_id", name="uq_ride_requester"),)

    id = Column(Integer, primary_key=True, index=True)
    ride_id = Column(Integer, nullable=False, index=True)
    requester_id = Column(Integer, nullable=False, index=True)
    seats_requested = Column(Integer, nullable=False, default=1)
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    notification_type = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)
    link = Column(String(250), nullable=True)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
