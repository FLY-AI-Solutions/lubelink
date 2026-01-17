import os
import uuid
import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Float, DateTime, ForeignKey, Boolean, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv("conf.env")

DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- MODELS ---

class ServiceRequest(Base):
    __tablename__ = "service_requests"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_name = Column(String(100), nullable=False)
    car_model = Column(String(100))
    address = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)
    service_type = Column(String(50)) # This holds the selected Oil Type
    scheduled_date = Column(String(50)) 
    scheduled_time = Column(String(50)) # New column
    status = Column(String(20), default="pending") 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Add any future columns here and restart the app??? :/
    # phone_number = Column(String(20))

class Bid(Base):
    __tablename__ = "bids"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String, ForeignKey("service_requests.id"))
    provider_name = Column(String(100))
    price = Column(Float)
    eta = Column(String(50))
    rating = Column(Float, default=5.0)
    is_ase_certified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- AUTO-SYNC PIPELINE ---

def sync_schema():
    """Production pipeline: Syncs Python models to Postgres without data loss."""
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    
    for table_class in [ServiceRequest, Bid]:
        table_name = table_class.__tablename__
        existing_cols = [c['name'] for c in inspector.get_columns(table_name)]
        
        for column in table_class.__table__.columns:
            if column.name not in existing_cols:
                col_type = str(column.type)
                print(f"🛠 Pipeline: Adding {column.name} to {table_name}...")
                with engine.connect() as conn:
                    conn.execute(text(f'ALTER TABLE {table_name} ADD COLUMN {column.name} {col_type}'))
                    conn.commit()
    print("Database is synced.")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()