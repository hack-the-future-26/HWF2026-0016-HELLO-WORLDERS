"""Clears products table and re-runs seed."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from models import Product

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with Session(engine) as db:
    deleted = db.query(Product).delete()
    db.commit()
    print(f"Deleted {deleted} existing products.")

# Now run the full seed
exec(open("seed.py").read())
