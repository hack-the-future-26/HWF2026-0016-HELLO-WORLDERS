"""Clear demo data and re-run seed. Use when you want a fresh app state."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Chat, Message, Product, User, Wishlist

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with Session(engine) as db:
    # Delete children first so this also works when foreign-key enforcement is enabled.
    counts = {
        "messages": db.query(Message).delete(synchronize_session=False),
        "chats": db.query(Chat).delete(synchronize_session=False),
        "wishlists": db.query(Wishlist).delete(synchronize_session=False),
        "products": db.query(Product).delete(synchronize_session=False),
        "users": db.query(User).delete(synchronize_session=False),
    }
    db.commit()
    print("Deleted: " + ", ".join(f"{name}={count}" for name, count in counts.items()))

exec(open("seed.py").read())
