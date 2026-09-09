from fastapi import FastAPI, Depends, Query, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from schemas import ProductCreate,UserCreate,ChatCreate,MessageCreate,ScamCheckRequest,WishlistCreate
import os
import shutil
import math
import uuid

from models import Base, Product, User, Chat, Message, Wishlist

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Thrift API")

os.makedirs("uploads", exist_ok=True)
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


def validate_edu_email(email: str):
    if "@" not in email or ".edu" not in email.lower():
        raise HTTPException(
            status_code=400,
            detail="Only verified university .edu email addresses are accepted (e.g. name@iitd.edu).",
        )


# ── root / health ─────────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "Welcome to Campus Thrift API!"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Backend and database are connected."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── products ──────────────────────────────────────────────────────────────────
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
    db: Session = Depends(get_db),
):
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
        seller_id=seller_id,
        title=title,
        category=category,
        price=price,
        condition=condition,
        description=description,
        image_url=image_url,
        latitude=latitude,
        longitude=longitude,
        status="active",
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
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.status = status
    db.commit()
    db.refresh(product)
    return {"success": True, "product": product}


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"success": True, "message": "Product deleted."}


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

@app.post("/users/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if "@" not in user.email or ".edu" not in user.email.lower():
        return {"success": False, "message": "Only verified university .edu email addresses are accepted."}

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        # Return existing user so the frontend can log in
        return {
            "success": True,
            "message": "Welcome back!",
            "user": existing_user,
        }

    new_user = User(
        name=user.name,
        email=user.email,
        college=user.college,
        verified=True,
        latitude=user.latitude,
        longitude=user.longitude,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"success": True, "message": "Registered successfully.", "user": new_user}


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found.")
    return u


# ── chats ─────────────────────────────────────────────────────────────────────

@app.get("/chats")
def get_user_chats(user_id: int, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(
        (Chat.buyer_id == user_id) | (Chat.seller_id == user_id)
    ).all()

    result = []
    for chat in chats:
        last_msg = (
            db.query(Message)
            .filter(Message.chat_id == chat.id)
            .order_by(Message.id.desc())
            .first()
        )
        other_id = chat.seller_id if chat.buyer_id == user_id else chat.buyer_id
        other_user = db.query(User).filter(User.id == other_id).first()
        product = db.query(Product).filter(Product.id == chat.product_id).first()

        result.append({
            "id": chat.id,
            "product_id": chat.product_id,
            "buyer_id": chat.buyer_id,
            "seller_id": chat.seller_id,
            "last_message": last_msg.message if last_msg else None,
            "last_message_id": last_msg.id if last_msg else 0,
            "other_user": {
                "id": other_user.id,
                "name": other_user.name,
                "email": other_user.email,
                "college": other_user.college,
                "verified": other_user.verified,
            } if other_user else None,
            "product": {
                "id": product.id,
                "title": product.title,
                "price": product.price,
                "image_url": product.image_url,
                "condition": product.condition,
            } if product else None,
        })

    result.sort(key=lambda x: x["last_message_id"], reverse=True)
    return {"success": True, "chats": result}

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
def create_chat(chat: ChatCreate, db: Session = Depends(get_db)):
    existing_chat = db.query(Chat).filter(
        Chat.product_id == chat.product_id,
        Chat.buyer_id == chat.buyer_id,
        Chat.seller_id == chat.seller_id,
    ).first()
    if existing_chat:
        return existing_chat

    new_chat = Chat(
        product_id=chat.product_id,
        buyer_id=chat.buyer_id,
        seller_id=chat.seller_id,
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat


@app.get("/chats")
def get_user_chats(user_id: int, db: Session = Depends(get_db)):
    """Return all chats where the given user is either buyer or seller."""
    chats = db.query(Chat).filter(
        (Chat.buyer_id == user_id) | (Chat.seller_id == user_id)
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
        other_user_id = chat.seller_id if chat.buyer_id == user_id else chat.buyer_id
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
def send_message(chat_id: int, message: MessageCreate, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        return {"success": False, "message": "Chat not found."}

    new_msg = Message(
        chat_id=chat_id,
        sender_id=message.sender_id,
        message=message.message,
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return {"success": True, "message": new_msg}


@app.get("/chats/{chat_id}/messages")
def get_messages(chat_id: int, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        return {"success": False, "message": "Chat not found."}

    msgs = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.id.asc())
        .all()
    )
    return {"success": True, "chat_id": chat_id, "messages": msgs}


# ── recommendations ───────────────────────────────────────────────────────────

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
        warnings.append("Price is unusually low — verify the listing carefully.")

    score = min(score, 100)
    risk_level = "HIGH" if score >= 60 else "MEDIUM" if score >= 30 else "LOW"

    return {"success": True, "risk_level": risk_level, "risk_score": score, "warnings": warnings}


# ── wishlist ──────────────────────────────────────────────────────────────────


# ---------------------------------------------------------------------------
# Wishlist
# ---------------------------------------------------------------------------

@app.post("/wishlist")
def add_to_wishlist(wishlist: WishlistCreate, db: Session = Depends(get_db)):
    existing_item = db.query(Wishlist).filter(
        Wishlist.user_id == wishlist.user_id,
        Wishlist.product_id == wishlist.product_id,
    ).first()
    if existing_item:
        return {"success": False, "message": "Product already in wishlist."}

    new_item = Wishlist(user_id=wishlist.user_id, product_id=wishlist.product_id)
    db.add(new_item)
    db.commit()
    db.refresh(item)
    return {"success": True, "message": "Added to wishlist.", "wishlist": item}

    return {"success": True, "message": "Product added to wishlist.", "wishlist": new_item}


@app.get("/wishlist/{user_id}")
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
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
def remove_from_wishlist(wishlist_id: int, db: Session = Depends(get_db)):
    wishlist_item = db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
    if not wishlist_item:
        return {"success": False, "message": "Wishlist item not found."}
    db.delete(wishlist_item)
    db.commit()
    return {"success": True, "message": "Product removed from wishlist."}
