from fastapi import FastAPI,Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from schemas import ProductCreate,UserCreate,ChatCreate,MessageCreate
import os
import math

from models import Base,Product,User,Chat,Message

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Thrift API")

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth's radius in km

    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    dlat = lat2 - lat1
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

def get_db():
    db = Session(engine)

    try:
        yield db
    finally:
        db.close()




@app.get("/")
def home():
    return {
        "message": "Welcome to Campus Thrift API!"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "Backend and database are connected"
        }

    except Exception as e:
        return {
            "status": "Database connection failed",
            "error": str(e)
        }

@app.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    new_product = Product(
        seller_id=product.seller_id,
        title=product.title,
        category=product.category,
        price=product.price,
        condition=product.condition,
        description=product.description,
        image_url=product.image_url,
        latitude=product.latitude,
        longitude=product.longitude
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@app.get("/products")
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return products

@app.get("/products/nearby")
def get_nearby_products(
    latitude: float,
    longitude: float,
    radius: float = 5,
    db: Session = Depends(get_db)
):

    products = db.query(Product).all()

    nearby_products = []

    for product in products:

        if product.latitude is None or product.longitude is None:
            continue

        distance = calculate_distance(
            latitude,
            longitude,
            product.latitude,
            product.longitude
        )

        if distance <= radius:
            nearby_products.append({
                "id": product.id,
                "title": product.title,
                "category": product.category,
                "price": product.price,
                "condition": product.condition,
                "description": product.description,
                "image_url": product.image_url,
                "distance_km": round(distance, 2)
            })

    return nearby_products


# adding new user
@app.post("/users/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    if "@" not in user.email:
        return {
            "success": False,
            "message": "Please enter a valid college email."
        }

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return {
            "success": False,
            "message": "User already registered."
        }

    new_user = User(
        name=user.name,
        email=user.email,
        college=user.college,
        verified=True,
        latitude=user.latitude,
        longitude=user.longitude
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Student registered successfully.",
        "user": new_user
    }

# chats
@app.post("/chats")
def create_chat(chat: ChatCreate, db: Session = Depends(get_db)):
    # Check if this chat already exists
    existing_chat = db.query(Chat).filter(
        Chat.product_id == chat.product_id,
        Chat.buyer_id == chat.buyer_id,
        Chat.seller_id == chat.seller_id
    ).first()

    if existing_chat:
        return existing_chat

    new_chat = Chat(
        product_id=chat.product_id,
        buyer_id=chat.buyer_id,
        seller_id=chat.seller_id
    )

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return new_chat

# actual messaging
@app.post("/chats/{chat_id}/messages")
def send_message(
    chat_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db)
):
    # Check whether the chat exists
    chat = db.query(Chat).filter(Chat.id == chat_id).first()

    if not chat:
        return {
            "success": False,
            "message": "Chat not found."
        }

    new_message = Message(
        chat_id=chat_id,
        sender_id=message.sender_id,
        message=message.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "success": True,
        "message": new_message
    }

@app.get("/chats/{chat_id}/messages")
def get_messages(
    chat_id: int,
    db: Session = Depends(get_db)
):
    # Check whether the chat exists
    chat = db.query(Chat).filter(Chat.id == chat_id).first()

    if not chat:
        return {
            "success": False,
            "message": "Chat not found."
        }

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.id.asc())
        .all()
    )

    return {
        "success": True,
        "chat_id": chat_id,
        "messages": messages
    }