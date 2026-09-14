"""Ensure current database tables and columns exist, then verify backend loads."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

with engine.connect() as conn:
    conn.execute(text(
        "ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active'"
    ))
    conn.commit()

# create_all adds the new rides, ride_requests, and notifications tables without
# changing existing application data.
from models import Base
Base.metadata.create_all(bind=engine)
print("Migration complete: ride and notification tables ensured.")

# Quick smoke-test that main.py loads without error
import sys
sys.path.insert(0, ".")
import main  # noqa: F401
print("main.py imports cleanly.")
