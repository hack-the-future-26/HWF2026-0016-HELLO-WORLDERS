from sqlalchemy.orm import Session
from main import engine
from models import Base, User, Product

# Create fresh tables
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = Session(bind=engine)

# ---------------- USERS ----------------

users = [
    User(name="Ananya", email="ananya@vnr.edu", college="VNR VJIET", verified=True, latitude=17.385, longitude=78.487),
    User(name="Rahul", email="rahul@rec.edu", college="REC", verified=True, latitude=17.389, longitude=78.489),
    User(name="Priya", email="priya@mgit.edu", college="MGIT", verified=True, latitude=17.382, longitude=78.484),
    User(name="Amar", email="amar@cbit.edu", college="CBIT", verified=True, latitude=17.395, longitude=78.492),
]

db.add_all(users)
db.commit()

# ---------------- PRODUCTS ----------------

products = [
    Product(
        seller_id=1,
        title="Casio FX-991ES Plus Calculator",
        category="Calculator",
        price=650,
        condition="Good",
        description="Used for one semester. Perfect working condition.",
        latitude=17.389,
        longitude=78.489,
    ),
    Product(
        seller_id=2,
        title="DBMS Textbook",
        category="Books",
        price=350,
        condition="Like New",
        description="Very neat copy with minimal highlighting.",
        latitude=17.384,
        longitude=78.486,
    ),
    Product(
        seller_id=3,
        title="White Lab Coat",
        category="Lab Coat",
        price=250,
        condition="Excellent",
        description="Size M. Used only for practicals.",
        latitude=17.381,
        longitude=78.483,
    ),
    Product(
        seller_id=4,
        title="Engineering Drawing Kit",
        category="Study Materials",
        price=500,
        condition="Good",
        description="Complete drawing instruments set.",
        latitude=17.394,
        longitude=78.491,
    ),
    Product(
        seller_id=1,
        title="Data Structures Notes",
        category="Notes",
        price=150,
        condition="Good",
        description="Complete handwritten notes for CSE.",
        latitude=17.386,
        longitude=78.488,
    ),
]

db.add_all(products)
db.commit()

db.close()

print("Campus Thrift demo data inserted successfully!")