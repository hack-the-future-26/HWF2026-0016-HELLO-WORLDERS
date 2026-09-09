"""
Seed script — populates the database with Indian students and campus listings.
Run once: python seed.py
Safe to re-run (checks for existing email before inserting).
"""
import os, sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Base, User, Product

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# Indian student users
# ---------------------------------------------------------------------------
USERS = [
    {"name": "Arjun Sharma",    "email": "arjun.sharma@iitd.edu",  "college": "IIT Delhi",          "verified": True},
    {"name": "Priya Nair",      "email": "priya.nair@bits.edu",     "college": "BITS Pilani",         "verified": True},
    {"name": "Rohan Mehta",     "email": "rohan.mehta@iitb.edu",    "college": "IIT Bombay",          "verified": True},
    {"name": "Sneha Iyer",      "email": "sneha.iyer@vit.edu",      "college": "VIT Vellore",         "verified": True},
    {"name": "Karthik Reddy",   "email": "karthik.r@nit.edu",       "college": "NIT Trichy",          "verified": True},
    {"name": "Anika Gupta",     "email": "anika.gupta@du.edu",      "college": "Delhi University",    "verified": True},
]

# ---------------------------------------------------------------------------
# Products with ₹ prices
# ---------------------------------------------------------------------------
PRODUCTS = [
    {
        "title": "Casio fx-991ES PLUS Scientific Calculator",
        "category": "electronics",
        "price": 650.0,
        "condition": "like-new",
        "description": "Used for one semester in Engineering Maths. All functions work perfectly. Comes with original slide cover and manual. Required for JEE and college exams.",
        "image_url": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "NCERT Physics Part 1 & 2 (Class 12)  Full Set",
        "category": "textbooks",
        "price": 180.0,
        "condition": "good",
        "description": "Both volumes of NCERT Physics Class 12. Minor pencil marks in first two chapters, easy to erase. Perfect for B.Tech first year revision.",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Havells Single-Door Mini Fridge (50L)  Hostel Approved",
        "category": "dorm-essentials",
        "price": 3200.0,
        "condition": "good",
        "description": "Compact hostel fridge. Runs quietly, no rust inside. Ideal for storing tiffin, fruits, cold drinks. Warden-approved for hostel rooms. Pick up from Hostel Block C.",
        "image_url": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
        "category": "electronics",
        "price": 8500.0,
        "condition": "like-new",
        "description": "Purchased 6 months ago. Excellent ANC for library study sessions. Includes original case, USB-C cable, and 3.5mm adapter. 30-hour battery life.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Hero Sprint Pro 26T Mountain Bicycle",
        "category": "bicycles",
        "price": 3500.0,
        "condition": "good",
        "description": "Great for campus commuting between departments. 21-speed gearing, front suspension, recently oiled chain and adjusted brakes. Includes lock and rear carrier.",
        "image_url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Lab Coat (Size M) + Safety Goggles  Chemistry Lab",
        "category": "lab-equipment",
        "price": 350.0,
        "condition": "like-new",
        "description": "Full-length white lab coat, freshly washed. Comes with IS-certified anti-fog safety goggles. Required for all B.Tech Chemistry and Biology lab sessions.",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Higher Engineering Mathematics B.S. Grewal (44th Ed.)",
        "category": "textbooks",
        "price": 420.0,
        "condition": "good",
        "description": "The go to reference for B.Tech Mathematics. Clean pages, solid binding. Covers Calculus, Linear Algebra, Differential Equations, and Probability.",
        "image_url": "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Dell 22\" Full HD Monitor (HDMI, VGA) Dual Setup Ready",
        "category": "electronics",
        "price": 5500.0,
        "condition": "like-new",
        "description": "Perfect for setting up a dual monitor coding station in your hostel room. Ultra-thin bezel, comes with HDMI and power cable. No dead pixels.",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Philips LED Desk Lamp with USB Charging Port",
        "category": "dorm-essentials",
        "price": 750.0,
        "condition": "brand-new",
        "description": "Box opened but never used. 5 brightness levels, USB-A port for phone charging, 360° flexible neck. Perfect for late-night study sessions in hostel.",
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Wrangler Campus Hoodie — IIT Delhi (Size L)",
        "category": "clothing",
        "price": 450.0,
        "condition": "like-new",
        "description": "Official campus merchandise hoodie, worn only twice during fests. No pilling or colour fade. Super warm for Delhi winter mornings at 8 AM lectures.",
        "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Introduction to Algorithms — CLRS (3rd Edition)",
        "category": "textbooks",
        "price": 950.0,
        "condition": "like-new",
        "description": "Standard CS algorithms textbook. Used for one course, no marks. Essential for placements, competitive programming, and core CS courses.",
        "image_url": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Ergonomic Mesh Study Chair with Lumbar Support",
        "category": "furniture",
        "price": 2800.0,
        "condition": "good",
        "description": "Breathable mesh back, height adjustable, smooth rolling casters. Way better than the hostel-issued plastic chair for long coding and study sessions.",
        "image_url": "https://unsplash.com/photos/a-black-office-chair-sitting-on-top-of-a-rug-MptBkpkdGrI",
        "status": "active",
    },
    {
        "title": "Prestige Electric Kettle 1.5L (Auto Shut-Off)",
        "category": "dorm-essentials",
        "price": 600.0,
        "condition": "like-new",
        "description": "Boils in under 4 minutes. Perfect for Maggi, chai, and coffee in the hostel. ISI-certified with auto shut-off. Hostel electricity approved.",
        "image_url": "https://images.unsplash.com/photo-1594213114663-d94db9b17125?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Logitech M331 Silent Wireless Mouse",
        "category": "electronics",
        "price": 950.0,
        "condition": "like-new",
        "description": "Silent click mechanism — ideal for library use. Long battery life (18 months on AA). Works on any surface, plug-and-play USB nano receiver.",
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Wildcraft 45L Campus Backpack (Black)",
        "category": "clothing",
        "price": 1100.0,
        "condition": "good",
        "description": "Durable Wildcraft backpack with padded 15.6\" laptop sleeve, multiple organiser pockets, and rain cover. Light wear on straps, no tears or broken zippers.",
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Arduino Uno + Starter Kit (Breadboard, Sensors, LEDs)",
        "category": "lab-equipment",
        "price": 900.0,
        "condition": "good",
        "description": "Complete kit for ECE/CS project work. Includes Arduino Uno R3, 830-point breadboard, jumper wires, DHT11 sensor, ultrasonic sensor, servos, and more.",
        "image_url": "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Organic Chemistry — Morrison & Boyd (6th Edition)",
        "category": "textbooks",
        "price": 520.0,
        "condition": "good",
        "description": "Classic Organic Chemistry reference for B.Tech Chemistry and Pharmacy students. A few highlighted sections, all pages intact.",
        "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "Milton Campus Water Bottle 1L (Insulated, Steel)",
        "category": "dorm-essentials",
        "price": 380.0,
        "condition": "like-new",
        "description": "Keeps water cold for 24 hours, hot for 12. Leak-proof lid, BPA-free. Fits in bicycle bottle cages. Used for one semester.",
        "image_url": "https://unsplash.com/photos/green-bottle-on-white-table-reEySFadyJQ",
        "status": "active",
    },
    {
        "title": "Anker 65W GaN USB-C Fast Charger + 2m Cable",
        "category": "electronics",
        "price": 1800.0,
        "condition": "brand-new",
        "description": "Charges MacBook, Dell, HP laptops and phone simultaneously. Foldable pins. Sealed box, never used — bought extra.",
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
    {
        "title": "3-Shelf Wire Storage Rack on Wheels",
        "category": "furniture",
        "price": 850.0,
        "condition": "good",
        "description": "Great for hostel shelving — books, stationery, toiletries. Folds flat for transport. Lockable wheels. Fits through standard hostel room door.",
        "image_url": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
        "status": "active",
    },
]

with Session(engine) as db:
    # Insert users, track their IDs
    user_ids = []
    for u in USERS:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if existing:
            print(f"  User exists: {u['email']} (id={existing.id})")
            user_ids.append(existing.id)
        else:
            new_user = User(
                name=u["name"],
                email=u["email"],
                college=u["college"],
                verified=u["verified"],
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            print(f"  Created user: {u['email']} (id={new_user.id})")
            user_ids.append(new_user.id)

    # Check if products already seeded
    existing_count = db.query(Product).count()
    if existing_count > 0:
        print(f"\nProducts already in DB ({existing_count} rows) — skipping product seed.")
        print("Delete all products first if you want to re-seed.")
    else:
        for i, p in enumerate(PRODUCTS):
            seller_id = user_ids[i % len(user_ids)]
            new_product = Product(
                seller_id=seller_id,
                title=p["title"],
                category=p["category"],
                price=p["price"],
                condition=p["condition"],
                description=p["description"],
                image_url=p["image_url"],
                status=p["status"],
            )
            db.add(new_product)
        db.commit()
        print(f"\nSeeded {len(PRODUCTS)} products successfully.")

print("\nDone!")
