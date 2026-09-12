from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: datetime
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    medical_record_number: str


class PatientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    date_of_birth: datetime
    gender: Optional[str]
    contact_number: Optional[str]
    email: Optional[str]
    address: Optional[str]
    medical_record_number: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResourceCreate(BaseModel):
    name: str
    resource_type: str
    quantity_available: int = 0
    quantity_total: int
    unit: Optional[str] = None
    location: Optional[str] = None
    status: str = "available"


class ResourceResponse(BaseModel):
    id: int
    name: str
    resource_type: str
    quantity_available: int
    quantity_total: int
    unit: Optional[str]
    location: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AdmissionCreate(BaseModel):
    patient_id: int
    admission_date: Optional[datetime] = None
    discharge_date: Optional[datetime] = None
    department: Optional[str] = None
    diagnosis: Optional[str] = None
    severity_level: Optional[str] = None
    status: str = "active"


class AdmissionResponse(BaseModel):
    id: int
    patient_id: int
    admission_date: datetime
    discharge_date: Optional[datetime]
    department: Optional[str]
    diagnosis: Optional[str]
    severity_level: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResourceAllocationCreate(BaseModel):
    resource_id: int
    admission_id: int
    quantity_allocated: int
    allocation_date: Optional[datetime] = None
    return_date: Optional[datetime] = None
    status: str = "allocated"
    notes: Optional[str] = None


class ResourceAllocationResponse(BaseModel):
    id: int
    resource_id: int
    admission_id: int
    quantity_allocated: int
    allocation_date: datetime
    return_date: Optional[datetime]
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
