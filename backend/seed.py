"""
Seed script — Indian students + campus listings with INR prices.
Safe to re-run: skips users that already exist; skips products if DB already has rows.
Run: python seed.py
"""
import os, sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Base, User, Product

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
Base.metadata.create_all(bind=engine)

USERS = [
    {"name": "Arjun Sharma",   "email": "arjun.sharma@iitd.edu",  "college": "IIT Delhi"},
    {"name": "Priya Nair",     "email": "priya.nair@bits.edu",    "college": "BITS Pilani"},
    {"name": "Rohan Mehta",    "email": "rohan.mehta@iitb.edu",   "college": "IIT Bombay"},
    {"name": "Sneha Iyer",     "email": "sneha.iyer@vit.edu",     "college": "VIT Vellore"},
    {"name": "Karthik Reddy",  "email": "karthik.r@nit.edu",      "college": "NIT Trichy"},
    {"name": "Anika Gupta",    "email": "anika.gupta@du.edu",     "college": "Delhi University"},
]

PRODUCTS = [
    {
        "title": "Casio fx-991ES PLUS Scientific Calculator",
        "category": "electronics", "price": 650.0, "condition": "like-new",
        "description": "One semester use. All functions perfect. Comes with slide cover & manual. Required for JEE and B.Tech exams.",
        "image_url": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "R.D. Sharma Class 12 Maths (Both Volumes)",
        "category": "textbooks", "price": 280.0, "condition": "good",
        "description": "Classic reference for PCM students. Minor pencil marks in first two chapters. Binding solid. Great for Board + JEE preparation.",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Havells 50L Single-Door Mini Fridge (Hostel Approved)",
        "category": "dorm-essentials", "price": 3400.0, "condition": "good",
        "description": "Compact & quiet — runs perfectly. Clean interior. Warden-approved for use in hostel rooms. Pickup from Hostel Block C.",
        "image_url": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        "category": "electronics", "price": 8500.0, "condition": "like-new",
        "description": "6 months old. Best-in-class ANC for library study sessions. Original case, USB-C & 3.5mm adapter included. 30-hour battery.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Hero Sprint Pro 26T Mountain Bicycle",
        "category": "bicycles", "price": 3200.0, "condition": "good",
        "description": "Perfect for commuting between departments. 21-speed, front suspension, recently oiled & brakes adjusted. Includes lock & rear carrier.",
        "image_url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Lab Coat (Size M) + IS-Certified Safety Goggles",
        "category": "lab-equipment", "price": 350.0, "condition": "like-new",
        "description": "Full-length white lab coat, freshly washed. Anti-fog IS-certified goggles. Required for B.Tech Chemistry & Biology lab sessions.",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "B.S. Grewal Higher Engineering Mathematics (44th Ed.)",
        "category": "textbooks", "price": 420.0, "condition": "good",
        "description": "Standard B.Tech Maths reference. Covers Calculus, Linear Algebra, Differential Equations & Probability. Clean pages, solid binding.",
        "image_url": "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Dell 22\" Full HD Monitor (HDMI + VGA) — Dual Setup Ready",
        "category": "electronics", "price": 5500.0, "condition": "like-new",
        "description": "Ultra-thin bezel, no dead pixels. Perfect for dual-monitor coding setup in hostel room. HDMI + power cable included.",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Philips LED Desk Lamp with USB Charging Port",
        "category": "dorm-essentials", "price": 750.0, "condition": "brand-new",
        "description": "Box opened to test only. 5 brightness levels, USB-A port, 360° flexible neck. Perfect for late-night study in hostel. Never used.",
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Introduction to Algorithms — CLRS 3rd Edition",
        "category": "textbooks", "price": 950.0, "condition": "like-new",
        "description": "CS bible for algorithms courses & placement prep. Zero marks, clean hardcover. Used for one course last semester.",
        "image_url": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Ergonomic Mesh Study Chair with Lumbar Support",
        "category": "furniture", "price": 2800.0, "condition": "good",
        "description": "Breathable mesh back, height adjustable, smooth rolling wheels. Far better than hostel-issued plastic chair for long study sessions.",
        "image_url": "https://images.unsplash.com/photo-1580481077195-c3a9a32296c0?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Prestige 1.5L Electric Kettle (Auto Shut-Off)",
        "category": "dorm-essentials", "price": 580.0, "condition": "like-new",
        "description": "Boils in under 4 minutes. Perfect for Maggi, chai, pour-over coffee. ISI-certified auto shut-off. Hostel electricity approved.",
        "image_url": "https://images.unsplash.com/photo-1594213114663-d94db9b17125?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Logitech M331 Silent Wireless Mouse",
        "category": "electronics", "price": 950.0, "condition": "like-new",
        "description": "Silent clicks — ideal for library. 18-month battery, works on any surface, plug-and-play nano receiver. 6 months old.",
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Wildcraft 45L Campus Backpack (Black)",
        "category": "clothing", "price": 1100.0, "condition": "good",
        "description": "Padded 15.6\" laptop sleeve, multiple organiser pockets, rain cover. Light strap wear, no tears or broken zippers.",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Arduino Uno R3 + Starter Kit (Breadboard, Sensors, LEDs)",
        "category": "lab-equipment", "price": 900.0, "condition": "good",
        "description": "Complete ECE/CS project kit — breadboard, jumper wires, DHT11, ultrasonic sensor, servo, resistors, LEDs. All tested & working.",
        "image_url": "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Morrison & Boyd Organic Chemistry (6th Ed.)",
        "category": "textbooks", "price": 520.0, "condition": "good",
        "description": "Classic OChem reference for B.Tech and Pharmacy students. A few highlighted sections, all pages intact.",
        "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Milton Campus Steel Insulated Water Bottle 1L",
        "category": "dorm-essentials", "price": 380.0, "condition": "like-new",
        "description": "Keeps cold 24hr, hot 12hr. Leak-proof, BPA-free. Fits bicycle bottle cage. One semester use.",
        "image_url": "https://images.unsplash.com/photo-1585565804112-f201f68c48b4?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "Anker 65W GaN USB-C Fast Charger + 2m Cable",
        "category": "electronics", "price": 1800.0, "condition": "brand-new",
        "description": "Charges MacBook / Dell / HP + phone simultaneously. Foldable pins, compact. Sealed box — bought extra.",
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "IIT Delhi Fest Hoodie — Rendezvous (Size L)",
        "category": "clothing", "price": 450.0, "condition": "like-new",
        "description": "Official Rendezvous fest merchandise hoodie. Worn twice. No pilling or colour fade. Perfect for Delhi winter morning lectures.",
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
    },
    {
        "title": "3-Shelf Wire Storage Rack on Wheels",
        "category": "furniture", "price": 850.0, "condition": "good",
        "description": "Great for hostel room shelving — books, stationery, toiletries. Folds flat for transport. Lockable wheels. Easy to carry.",
        "image_url": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
    },
]

with Session(engine) as db:
    # Seed users
    user_ids: list[int] = []
    for u in USERS:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            print(f"  [skip] user exists: {u['email']} (id={existing.id})")
            user_ids.append(existing.id)
        else:
            new_u = User(name=u["name"], email=u["email"], college=u["college"], verified=True)
            db.add(new_u)
            db.commit()
            db.refresh(new_u)
            print(f"  [ok]   created user: {u['email']} (id={new_u.id})")
            user_ids.append(new_u.id)

    # Seed products only if DB is empty
    existing_count = db.query(Product).count()
    if existing_count > 0:
        print(f"\nProducts already in DB ({existing_count} rows). Skipping product seed.")
        print("Run: python reseed.py  — to clear and re-seed products.")
    else:
        for i, p in enumerate(PRODUCTS):
            db.add(Product(
                seller_id=user_ids[i % len(user_ids)],
                title=p["title"],
                category=p["category"],
                price=p["price"],
                condition=p["condition"],
                description=p["description"],
                image_url=p["image_url"],
                status="active",
            ))
        db.commit()
        print(f"\n[ok] Seeded {len(PRODUCTS)} products.")

print("\nDone!")
