from fastapi import FastAPI, Depends, Query, UploadFile, File,Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from schemas import ProductCreate,UserCreate,ChatCreate,MessageCreate,ScamCheckRequest,WishlistCreate
import os
import shutil
import math

from models import Base,Product,User,Chat,Message,Wishlist

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Thrift API")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def create_product(
    seller_id: int = Form(...),
    title: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    condition: str = Form(...),
    description: str = Form(None),
    latitude: float = Form(None),
    longitude: float = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url = None

    if image:
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, image.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"/uploads/{image.filename}"

    new_product = Product(
        seller_id=seller_id,
        title=title,
        category=category,
        price=price,
        condition=condition,
        description=description,
        image_url=image_url,
        latitude=latitude,
        longitude=longitude
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "success": True,
        "message": "Product created successfully.",
        "product": new_product
    }
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

@app.get("/recommendations")
def get_recommendations(
    category: str,
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()

    recommendations = []

    for product in products:
        if product.latitude is None or product.longitude is None:
            continue

        distance = calculate_distance(
            latitude,
            longitude,
            product.latitude,
            product.longitude
        )

        # Ignore products more than 10 km away
        if distance > 10:
            continue

        score = 0

        # Category match
        if product.category.lower() == category.lower():
            score += 60

        # Nearby products get higher score
        if distance <= 2:
            score += 30
        elif distance <= 5:
            score += 20
        else:
            score += 10

        # Lower-priced products get a small bonus
        if product.price <= 1000:
            score += 10

        recommendations.append({
            "id": product.id,
            "title": product.title,
            "category": product.category,
            "price": product.price,
            "condition": product.condition,
            "description": product.description,
            "image_url": product.image_url,
            "distance_km": round(distance, 2),
            "recommendation_score": score
        })

    recommendations.sort(
        key=lambda x: x["recommendation_score"],
        reverse=True
    )

    return {
        "success": True,
        "category": category,
        "recommendations": recommendations[:5]
    }

@app.post("/scam-check")
def check_scam(
    listing: ScamCheckRequest
):
    score = 0
    warnings = []

    text = (
        listing.title + " " + (listing.description or "")
    ).lower()

    # Suspicious keywords
    suspicious_words = [
        "urgent",
        "advance payment",
        "send money",
        "pay first",
        "payment outside",
        "upi first",
        "deposit"
    ]

    for word in suspicious_words:
        if word in text:
            score += 25
            warnings.append(f"Suspicious phrase detected: '{word}'")

    # Unusually low price
    if listing.price < 100:
        score += 20
        warnings.append("Price is unusually low.")

    # Limit score to 100
    score = min(score, 100)

    if score >= 60:
        risk_level = "HIGH"
    elif score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "success": True,
        "risk_level": risk_level,
        "risk_score": score,
        "warnings": warnings
    }

@app.post("/wishlist")
def add_to_wishlist(
    wishlist: WishlistCreate,
    db: Session = Depends(get_db)
):
    # Check if product is already in wishlist
    existing_item = db.query(Wishlist).filter(
        Wishlist.user_id == wishlist.user_id,
        Wishlist.product_id == wishlist.product_id
    ).first()

    if existing_item:
        return {
            "success": False,
            "message": "Product already in wishlist."
        }

    new_item = Wishlist(
        user_id=wishlist.user_id,
        product_id=wishlist.product_id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {
        "success": True,
        "message": "Product added to wishlist.",
        "wishlist": new_item
    }

@app.get("/wishlist/{user_id}")
def get_wishlist(
    user_id: int,
    db: Session = Depends(get_db)
):
    wishlist_items = (
        db.query(Wishlist)
        .filter(Wishlist.user_id == user_id)
        .all()
    )

    products = []

    for item in wishlist_items:
        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if product:
            products.append({
                "wishlist_id": item.id,
                "product_id": product.id,
                "title": product.title,
                "category": product.category,
                "price": product.price,
                "condition": product.condition,
                "description": product.description,
                "image_url": product.image_url
            })

    return {
        "success": True,
        "user_id": user_id,
        "wishlist": products
    }


@app.delete("/wishlist/{wishlist_id}")
def remove_from_wishlist(
    wishlist_id: int,
    db: Session = Depends(get_db)
):
    wishlist_item = db.query(Wishlist).filter(
        Wishlist.id == wishlist_id
    ).first()

    if not wishlist_item:
        return {
            "success": False,
            "message": "Wishlist item not found."
        }

    db.delete(wishlist_item)
    db.commit()

    return {
        "success": True,
        "message": "Product removed from wishlist."
    }

