from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

from backend.config import settings

Base = declarative_base()


class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    gender = Column(String(20))
    contact_number = Column(String(20))
    email = Column(String(100))
    address = Column(Text)
    medical_record_number = Column(String(50), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    admissions = relationship("Admission", back_populates="patient")


class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    resource_type = Column(String(50), nullable=False)
    quantity_available = Column(Integer, default=0)
    quantity_total = Column(Integer, nullable=False)
    unit = Column(String(50))
    location = Column(String(200))
    status = Column(String(50), default="available")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    allocations = relationship("ResourceAllocation", back_populates="resource")


class Admission(Base):
    __tablename__ = "admissions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    admission_date = Column(DateTime, default=datetime.utcnow)
    discharge_date = Column(DateTime, nullable=True)
    department = Column(String(100))
    diagnosis = Column(Text)
    severity_level = Column(String(20))
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    patient = relationship("Patient", back_populates="admissions")
    resource_allocations = relationship("ResourceAllocation", back_populates="admission")


class ResourceAllocation(Base):
    __tablename__ = "resource_allocations"
    
    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    admission_id = Column(Integer, ForeignKey("admissions.id"), nullable=False)
    quantity_allocated = Column(Integer, nullable=False)
    allocation_date = Column(DateTime, default=datetime.utcnow)
    return_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="allocated")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    resource = relationship("Resource", back_populates="allocations")
    admission = relationship("Admission", back_populates="resource_allocations")


engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
