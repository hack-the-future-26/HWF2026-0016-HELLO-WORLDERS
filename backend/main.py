from typing import Optional
from fastapi import FastAPI, Depends, Query, UploadFile, File, Form, HTTPException, status as http_status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from schemas import (
    ProductCreate,
    UserCreate,
    ChatCreate,
    MessageCreate,
    ScamCheckRequest,
    WishlistCreate,
    UserRegister,
    UserLogin,
    TokenResponse,
)
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
import os
import shutil
import math
import uuid

from models import Base, Product, User, Chat, Message, Wishlist

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)
app = FastAPI(title="Campus Thrift API")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Allow Vite dev server (port 5173) and any other origins for hackathon
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",  # vite preview
        "http://localhost:3000",
    ],
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
    return {"message": "Welcome to Campus Thrift API!"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "Backend and database are connected"}
    except Exception as e:
        return {
            "status": "Database connection failed",
            "error": str(e)
        }

@app.post("/products")
def create_product(
    title: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    condition: str = Form(...),
    seller_id: Optional[int] = Form(None),
    description: str = Form(None),
    latitude: float = Form(None),
    longitude: float = Form(None),
    image: UploadFile = File(None),
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    authenticated_seller_id = int(current_user_payload["sub"])
    image_url = None

    if image and image.filename:
        upload_folder = "uploads"
        os.makedirs(upload_folder, exist_ok=True)
        # Use a unique filename to avoid collisions
        ext = os.path.splitext(image.filename)[1]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(upload_folder, unique_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{unique_name}"

    new_product = Product(
        seller_id=authenticated_seller_id,
        title=title,
        category=category,
        price=price,
        condition=condition,
        description=description,
        image_url=image_url,
        latitude=latitude,
        longitude=longitude,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "success": True,
        "message": "Product created successfully.",
        "product": new_product,
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
    db: Session = Depends(get_db),
):
    products = db.query(Product).all()
    nearby_products = []
    for product in products:
        if product.latitude is None or product.longitude is None:
            continue
        distance = calculate_distance(latitude, longitude, product.latitude, product.longitude)
        if distance <= radius:
            nearby_products.append(
                {
                    "id": product.id,
                    "title": product.title,
                    "category": product.category,
                    "price": product.price,
                    "condition": product.condition,
                    "description": product.description,
                    "image_url": product.image_url,
                    "distance_km": round(distance, 2),
                }
            )
    return nearby_products


@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.patch("/products/{product_id}/status")
def update_product_status(
    product_id: int,
    status: str = Query(..., pattern="^(active|sold)$"),
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.seller_id != int(current_user_payload["sub"]):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this product.",
        )
    product.status = status
    db.commit()
    db.refresh(product)
    return {"success": True, "product": product}


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.seller_id != int(current_user_payload["sub"]):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this product.",
        )
    db.delete(product)
    db.commit()
    return {"success": True, "message": "Product deleted."}


# ---------------------------------------------------------------------------
# Authentication (JWT)
# ---------------------------------------------------------------------------

@app.post("/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new student with email and password, returning a JWT token."""
    existing_user = db.query(User).filter(User.email == user_data.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    hashed_pw = hash_password(user_data.password)
    new_user = User(
        name=user_data.name.strip(),
        email=user_data.email.strip().lower(),
        college=user_data.college.strip() if user_data.college else "Campus University",
        verified=True,
        latitude=user_data.latitude,
        longitude=user_data.longitude,
        password_hash=hashed_pw,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "college": new_user.college,
            "verified": new_user.verified,
        },
    }


@app.post("/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a student with email and password, returning a JWT token."""
    user = db.query(User).filter(User.email == credentials.email.strip().lower()).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=http_status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "college": user.college,
            "verified": user.verified,
        },
    }


@app.get("/auth/me")
def get_current_user_profile(
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve profile of the currently authenticated user."""
    user_id = int(current_user_payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="User not found.")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "college": user.college,
        "verified": user.verified,
        "latitude": user.latitude,
        "longitude": user.longitude,
    }


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

@app.post("/users/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        # Return existing user so the frontend can log in
        return {
            "success": True,
            "message": "Welcome back!",
            "user": existing_user,
        }

    password_hash = hash_password(user.password) if user.password else None
    new_user = User(
        name=user.name,
        email=user.email,
        college=user.college,
        verified=True,
        latitude=user.latitude,
        longitude=user.longitude,
        password_hash=password_hash,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Student registered successfully.",
        "user": new_user,
    }


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ---------------------------------------------------------------------------
# Chats & Messages
# ---------------------------------------------------------------------------

@app.post("/chats")
def create_chat(
    chat: ChatCreate,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    buyer_id = int(current_user_payload["sub"])
    existing_chat = db.query(Chat).filter(
        Chat.product_id == chat.product_id,
        Chat.buyer_id == buyer_id,
        Chat.seller_id == chat.seller_id,
    ).first()
    if existing_chat:
        return existing_chat

    new_chat = Chat(
        product_id=chat.product_id,
        buyer_id=buyer_id,
        seller_id=chat.seller_id,
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat


@app.get("/chats")
@app.get("/chats/{user_id}")
def get_user_chats(
    user_id: Optional[int] = None,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all chats where the given user is either buyer or seller."""
    auth_user_id = int(current_user_payload["sub"])
    if user_id is not None and user_id != auth_user_id:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view another user's chats.",
        )

    target_user_id = auth_user_id
    chats = db.query(Chat).filter(
        (Chat.buyer_id == target_user_id) | (Chat.seller_id == target_user_id)
    ).all()

    result = []
    for chat in chats:
        # Get last message
        last_msg = (
            db.query(Message)
            .filter(Message.chat_id == chat.id)
            .order_by(Message.id.desc())
            .first()
        )

        # Determine the other participant
        other_user_id = chat.seller_id if chat.buyer_id == target_user_id else chat.buyer_id
        other_user = db.query(User).filter(User.id == other_user_id).first()
        product = db.query(Product).filter(Product.id == chat.product_id).first()

        result.append(
            {
                "id": chat.id,
                "product_id": chat.product_id,
                "buyer_id": chat.buyer_id,
                "seller_id": chat.seller_id,
                "last_message": last_msg.message if last_msg else None,
                "last_message_id": last_msg.id if last_msg else None,
                "other_user": {
                    "id": other_user.id,
                    "name": other_user.name,
                    "email": other_user.email,
                    "college": other_user.college,
                    "verified": other_user.verified,
                }
                if other_user
                else None,
                "product": {
                    "id": product.id,
                    "title": product.title,
                    "price": product.price,
                    "image_url": product.image_url,
                    "condition": product.condition,
                }
                if product
                else None,
            }
        )

    # Sort by last message descending (chats with messages first)
    result.sort(key=lambda x: x["last_message_id"] or 0, reverse=True)
    return {"success": True, "chats": result}


@app.post("/chats/{chat_id}/messages")
def send_message(
    chat_id: int,
    message: MessageCreate,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")

    sender_id = int(current_user_payload["sub"])
    if sender_id != chat.buyer_id and sender_id != chat.seller_id:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this chat.",
        )

    new_message = Message(
        chat_id=chat_id,
        sender_id=sender_id,
        message=message.message,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {"success": True, "message": new_message}


@app.get("/chats/{chat_id}/messages")
def get_messages(
    chat_id: int,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Chat not found.")

    user_id = int(current_user_payload["sub"])
    if user_id != chat.buyer_id and user_id != chat.seller_id:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this chat.",
        )

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.id.asc())
        .all()
    )

    return {"success": True, "chat_id": chat_id, "messages": messages}


# ---------------------------------------------------------------------------
# Recommendations
# ---------------------------------------------------------------------------

@app.get("/recommendations")
def get_recommendations(
    category: str,
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db),
):
    products = db.query(Product).all()
    recommendations = []

    for product in products:
        if product.latitude is None or product.longitude is None:
            continue

        distance = calculate_distance(latitude, longitude, product.latitude, product.longitude)
        if distance > 10:
            continue

        score = 0
        if product.category.lower() == category.lower():
            score += 60
        if distance <= 2:
            score += 30
        elif distance <= 5:
            score += 20
        else:
            score += 10
        if product.price <= 1000:
            score += 10

        recommendations.append(
            {
                "id": product.id,
                "title": product.title,
                "category": product.category,
                "price": product.price,
                "condition": product.condition,
                "description": product.description,
                "image_url": product.image_url,
                "distance_km": round(distance, 2),
                "recommendation_score": score,
            }
        )

    recommendations.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return {"success": True, "category": category, "recommendations": recommendations[:5]}


# ---------------------------------------------------------------------------
# Scam Check
# ---------------------------------------------------------------------------

@app.post("/scam-check")
def check_scam(listing: ScamCheckRequest):
    score = 0
    warnings = []
    text = (listing.title + " " + (listing.description or "")).lower()

    suspicious_words = [
        "urgent",
        "advance payment",
        "send money",
        "pay first",
        "payment outside",
        "upi first",
        "deposit",
    ]
    for word in suspicious_words:
        if word in text:
            score += 25
            warnings.append(f"Suspicious phrase detected: '{word}'")

    if listing.price < 100:
        score += 20
        warnings.append("Price is unusually low.")

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
        "warnings": warnings,
    }


# ---------------------------------------------------------------------------
# Wishlist
# ---------------------------------------------------------------------------

@app.post("/wishlist")
def add_to_wishlist(
    wishlist: WishlistCreate,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = int(current_user_payload["sub"])
    existing_item = db.query(Wishlist).filter(
        Wishlist.user_id == user_id,
        Wishlist.product_id == wishlist.product_id,
    ).first()
    if existing_item:
        return {"success": False, "message": "Product already in wishlist."}

    new_item = Wishlist(user_id=user_id, product_id=wishlist.product_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return {"success": True, "message": "Product added to wishlist.", "wishlist": new_item}


@app.get("/wishlist/{user_id}")
def get_wishlist(
    user_id: int,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_user_id = int(current_user_payload["sub"])
    if auth_user_id != user_id:
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access another user's wishlist.",
        )
    wishlist_items = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()
    products = []
    for item in wishlist_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            products.append(
                {
                    "wishlist_id": item.id,
                    "product_id": product.id,
                    "title": product.title,
                    "category": product.category,
                    "price": product.price,
                    "condition": product.condition,
                    "description": product.description,
                    "image_url": product.image_url,
                }
            )
    return {"success": True, "user_id": user_id, "wishlist": products}


@app.delete("/wishlist/{wishlist_id}")
def remove_from_wishlist(
    wishlist_id: int,
    current_user_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    wishlist_item = db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
    if not wishlist_item:
        return {"success": False, "message": "Wishlist item not found."}
    if wishlist_item.user_id != int(current_user_payload["sub"]):
        raise HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this wishlist item.",
        )
    db.delete(wishlist_item)
    db.commit()
    return {"success": True, "message": "Product removed from wishlist."}
