"""Add status column to products if not already present, then verify backend loads."""
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
    print("Migration complete: status column ensured on products table.")

# Quick smoke-test that main.py loads without error
import sys
sys.path.insert(0, ".")
import main  # noqa: F401
print("main.py imports cleanly.")
