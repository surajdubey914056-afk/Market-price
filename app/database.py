"""
Database Layer for AgriPrice AI
SQLite & SQLAlchemy ORM Models for Historical Data, Prediction Logs, and Alerts
"""

import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Boolean, Text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./agri_market.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class HistoricalPriceRecord(Base):
    __tablename__ = "historical_price_records"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), index=True)
    commodity_id = Column(String(50), index=True)
    commodity_name = Column(String(100))
    category = Column(String(50))
    state = Column(String(50), index=True)
    mandi = Column(String(100), index=True)
    modal_price = Column(Float)
    min_price = Column(Float)
    max_price = Column(Float)
    arrival_tons = Column(Float)
    rainfall_anomaly = Column(String(50), default="Normal")
    fuel_index = Column(Float, default=100.0)

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    commodity = Column(String(100))
    state = Column(String(50))
    market = Column(String(100))
    forecast_days = Column(Integer)
    current_price = Column(Float)
    predicted_price = Column(Float)
    price_change = Column(Float)
    price_change_pct = Column(Float)
    confidence_score = Column(Float)
    trend_direction = Column(String(50))
    risk_level = Column(String(50))
    advisory = Column(Text)
    model_used = Column(String(100))

class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    farmer_name = Column(String(100))
    contact = Column(String(100))
    commodity = Column(String(100))
    target_price = Column(Float)
    condition = Column(String(20)) # "ABOVE" or "BELOW"
    is_active = Column(Boolean, default=True)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
