"""Clear all products and re-run seed. Use when you want fresh listings."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Product

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with Session(engine) as db:
    n = db.query(Product).delete()
    db.commit()
    print(f"Deleted {n} existing products.")

exec(open("seed.py").read())
