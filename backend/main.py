from fastapi import FastAPI, Depends, Query, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from schemas import UserCreate, ChatCreate, MessageCreate, ScamCheckRequest, WishlistCreate
import os, shutil, math, uuid

from models import Base, Product, User, Chat, Message, Wishlist

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Thrift API")

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ── CORS ─────────────────────────────────────────────────────────────────────
# allow_credentials=True is incompatible with allow_origins=["*"]
# Always list origins explicitly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── helpers ───────────────────────────────────────────────────────────────────

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lat2 = math.radians(lat1), math.radians(lat2)
    dlat = lat2 - lat1
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


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
    return {"message": "Welcome to CampusThrift API!"}


@app.get("/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Backend and database are connected."}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# ── products ──────────────────────────────────────────────────────────────────

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@app.get("/products/nearby")
def get_nearby_products(
    latitude: float,
    longitude: float,
    radius: float = 5,
    db: Session = Depends(get_db),
):
    result = []
    for p in db.query(Product).all():
        if p.latitude is None or p.longitude is None:
            continue
        dist = haversine(latitude, longitude, p.latitude, p.longitude)
        if dist <= radius:
            result.append({**p.__dict__, "distance_km": round(dist, 2)})
    return result


@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found.")
    return p


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
        ext = os.path.splitext(image.filename)[1].lower()
        safe_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join("uploads", safe_name)
        with open(file_path, "wb") as buf:
            shutil.copyfileobj(image.file, buf)
        image_url = f"/uploads/{safe_name}"

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
    return {"success": True, "message": "Product created successfully.", "product": new_product}


@app.patch("/products/{product_id}/status")
def update_product_status(
    product_id: int,
    status: str = Query(...),
    db: Session = Depends(get_db),
):
    if status not in ("active", "sold"):
        raise HTTPException(status_code=400, detail="status must be 'active' or 'sold'.")
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found.")
    p.status = status
    db.commit()
    db.refresh(p)
    return {"success": True, "product": p}


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found.")
    db.delete(p)
    db.commit()
    return {"success": True, "message": "Product deleted."}


# ── users ─────────────────────────────────────────────────────────────────────

@app.post("/users/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    validate_edu_email(user.email)

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        # Treat as login — return the existing user
        return {"success": True, "message": "Welcome back!", "user": existing}

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


@app.post("/chats")
def create_chat(chat: ChatCreate, db: Session = Depends(get_db)):
    existing = db.query(Chat).filter(
        Chat.product_id == chat.product_id,
        Chat.buyer_id == chat.buyer_id,
        Chat.seller_id == chat.seller_id,
    ).first()
    if existing:
        return existing

    new_chat = Chat(
        product_id=chat.product_id,
        buyer_id=chat.buyer_id,
        seller_id=chat.seller_id,
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat


@app.post("/chats/{chat_id}/messages")
def send_message(chat_id: int, message: MessageCreate, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")

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
        raise HTTPException(status_code=404, detail="Chat not found.")

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
    recs = []
    for p in db.query(Product).all():
        if p.latitude is None or p.longitude is None:
            continue
        dist = haversine(latitude, longitude, p.latitude, p.longitude)
        if dist > 10:
            continue
        score = 0
        if p.category.lower() == category.lower():
            score += 60
        score += 30 if dist <= 2 else 20 if dist <= 5 else 10
        if p.price <= 1000:
            score += 10
        recs.append({**p.__dict__, "distance_km": round(dist, 2), "recommendation_score": score})

    recs.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return {"success": True, "category": category, "recommendations": recs[:5]}


# ── scam check ────────────────────────────────────────────────────────────────

@app.post("/scam-check")
def check_scam(listing: ScamCheckRequest):
    score = 0
    warnings = []
    text = (listing.title + " " + (listing.description or "")).lower()

    for word in ["urgent", "advance payment", "send money", "pay first",
                 "payment outside", "upi first", "deposit", "gift card",
                 "wire transfer", "western union"]:
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

@app.post("/wishlist")
def add_to_wishlist(wishlist: WishlistCreate, db: Session = Depends(get_db)):
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == wishlist.user_id,
        Wishlist.product_id == wishlist.product_id,
    ).first()
    if existing:
        return {"success": False, "message": "Already in wishlist."}

    item = Wishlist(user_id=wishlist.user_id, product_id=wishlist.product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"success": True, "message": "Added to wishlist.", "wishlist": item}


@app.get("/wishlist/{user_id}")
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    items = db.query(Wishlist).filter(Wishlist.user_id == user_id).all()
    products = []
    for item in items:
        p = db.query(Product).filter(Product.id == item.product_id).first()
        if p:
            products.append({
                "wishlist_id": item.id,
                "product_id": p.id,
                "title": p.title,
                "category": p.category,
                "price": p.price,
                "condition": p.condition,
                "description": p.description,
                "image_url": p.image_url,
            })
    return {"success": True, "user_id": user_id, "wishlist": products}


@app.delete("/wishlist/{wishlist_id}")
def remove_from_wishlist(wishlist_id: int, db: Session = Depends(get_db)):
    item = db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found.")
    db.delete(item)
    db.commit()
    return {"success": True, "message": "Removed from wishlist."}
