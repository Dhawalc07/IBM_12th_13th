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


class MLPredictionInput(BaseModel):
    # Rural climate & epidemiological parameters
    rainfall_mm: Optional[float] = 15.0
    rainfall_anomaly_pct: Optional[float] = 10.0
    temp_mean_c: Optional[float] = 28.5
    humidity_pct: Optional[float] = 65.0
    flood_risk_score: Optional[float] = 0.25
    vector_breeding_pressure: Optional[float] = 2.5
    waterborne_runoff_risk: Optional[float] = 1.2
    population: Optional[int] = 3000
    tap_water_access_pct: Optional[float] = 35.0
    sanitation_access_pct: Optional[float] = 50.0
    distance_phc_km: Optional[float] = 7.5
    all_weather_road: Optional[int] = 1
    mo_in_position: Optional[int] = 1
    anm_present: Optional[int] = 1
    asha_workers_count: Optional[int] = 3
    cold_chain_functional: Optional[int] = 1

    # Inpatient clinical vitals
    age: Optional[int] = 45
    gender: Optional[str] = "Male"
    heart_rate: Optional[float] = 75.0
    systolic_bp: Optional[float] = 120.0
    diastolic_bp: Optional[float] = 80.0
    spo2: Optional[float] = 98.0
    respiratory_rate: Optional[float] = 16.0
    temperature: Optional[float] = 37.0
    comorbidities: Optional[str] = "None"
    department: Optional[str] = "Emergency & Trauma"


class MLPredictionResponse(BaseModel):
    predicted_malaria_cases_2w: Optional[float] = None
    predicted_diarrhea_cases_2w: Optional[float] = None
    outbreak_risk_level: Optional[str] = None
    risk_confidence: Optional[float] = None
    hazard_score: Optional[float] = None
    risk_probabilities: Optional[dict] = None
    recommended_resource: Optional[str] = None
    epidemiological_warnings: Optional[list] = None
    clinical_rationale: Optional[str] = None

    # Backward compatibility aliases
    predicted_severity: Optional[str] = None
    severity_confidence: Optional[float] = None
    risk_score: Optional[float] = None


class ModelMetadataResponse(BaseModel):
    status: str
    metadata: Optional[dict] = None
