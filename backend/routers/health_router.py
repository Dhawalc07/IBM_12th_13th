from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from backend.models import Patient, Resource, Admission, ResourceAllocation, get_db
from backend.schemas import (
    PatientCreate, PatientResponse,
    ResourceCreate, ResourceResponse,
    AdmissionCreate, AdmissionResponse,
    ResourceAllocationCreate, ResourceAllocationResponse
)

router = APIRouter()


@router.get("/health")
def get_system_health(db: Session = Depends(get_db)):
    patients_count = db.query(Patient).count()
    resources_count = db.query(Resource).count()
    admissions_count = db.query(Admission).count()
    allocations_count = db.query(ResourceAllocation).count()
    active_admissions = db.query(Admission).filter(Admission.status == "active").count()
    
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat(),
        "counts": {
            "patients": patients_count,
            "resources": resources_count,
            "admissions": admissions_count,
            "active_admissions": active_admissions,
            "allocations": allocations_count
        }
    }


@router.post("/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.get("/patients", response_model=List[PatientResponse])
def list_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients


@router.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.put("/patients/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    for key, value in patient.dict().items():
        setattr(db_patient, key, value)
    
    db_patient.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(db_patient)
    db.commit()
    return None


@router.post("/resources", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
def create_resource(resource: ResourceCreate, db: Session = Depends(get_db)):
    db_resource = Resource(**resource.dict())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource


@router.get("/resources", response_model=List[ResourceResponse])
def list_resources(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    resources = db.query(Resource).offset(skip).limit(limit).all()
    return resources


@router.get("/resources/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.put("/resources/{resource_id}", response_model=ResourceResponse)
def update_resource(resource_id: int, resource: ResourceCreate, db: Session = Depends(get_db)):
    db_resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    for key, value in resource.dict().items():
        setattr(db_resource, key, value)
    
    db_resource.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_resource)
    return db_resource


@router.delete("/resources/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    db_resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    db.delete(db_resource)
    db.commit()
    return None


@router.post("/admissions", response_model=AdmissionResponse, status_code=status.HTTP_201_CREATED)
def create_admission(admission: AdmissionCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == admission.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db_admission = Admission(**admission.dict())
    db.add(db_admission)
    db.commit()
    db.refresh(db_admission)
    return db_admission


@router.get("/admissions", response_model=List[AdmissionResponse])
def list_admissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    admissions = db.query(Admission).offset(skip).limit(limit).all()
    return admissions


@router.get("/admissions/{admission_id}", response_model=AdmissionResponse)
def get_admission(admission_id: int, db: Session = Depends(get_db)):
    admission = db.query(Admission).filter(Admission.id == admission_id).first()
    if not admission:
        raise HTTPException(status_code=404, detail="Admission not found")
    return admission


@router.put("/admissions/{admission_id}", response_model=AdmissionResponse)
def update_admission(admission_id: int, admission: AdmissionCreate, db: Session = Depends(get_db)):
    db_admission = db.query(Admission).filter(Admission.id == admission_id).first()
    if not db_admission:
        raise HTTPException(status_code=404, detail="Admission not found")
    
    for key, value in admission.dict().items():
        setattr(db_admission, key, value)
    
    db_admission.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_admission)
    return db_admission


@router.delete("/admissions/{admission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admission(admission_id: int, db: Session = Depends(get_db)):
    db_admission = db.query(Admission).filter(Admission.id == admission_id).first()
    if not db_admission:
        raise HTTPException(status_code=404, detail="Admission not found")
    
    db.delete(db_admission)
    db.commit()
    return None


@router.post("/resource-allocations", response_model=ResourceAllocationResponse, status_code=status.HTTP_201_CREATED)
def create_resource_allocation(allocation: ResourceAllocationCreate, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == allocation.resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    admission = db.query(Admission).filter(Admission.id == allocation.admission_id).first()
    if not admission:
        raise HTTPException(status_code=404, detail="Admission not found")
    
    if resource.quantity_available < allocation.quantity_allocated:
        raise HTTPException(status_code=400, detail="Insufficient resource quantity available")
    
    db_allocation = ResourceAllocation(**allocation.dict())
    resource.quantity_available -= allocation.quantity_allocated
    
    db.add(db_allocation)
    db.commit()
    db.refresh(db_allocation)
    return db_allocation


@router.get("/resource-allocations", response_model=List[ResourceAllocationResponse])
def list_resource_allocations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    allocations = db.query(ResourceAllocation).offset(skip).limit(limit).all()
    return allocations


@router.get("/resource-allocations/{allocation_id}", response_model=ResourceAllocationResponse)
def get_resource_allocation(allocation_id: int, db: Session = Depends(get_db)):
    allocation = db.query(ResourceAllocation).filter(ResourceAllocation.id == allocation_id).first()
    if not allocation:
        raise HTTPException(status_code=404, detail="Resource allocation not found")
    return allocation


@router.delete("/resource-allocations/{allocation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource_allocation(allocation_id: int, db: Session = Depends(get_db)):
    db_allocation = db.query(ResourceAllocation).filter(ResourceAllocation.id == allocation_id).first()
    if not db_allocation:
        raise HTTPException(status_code=404, detail="Resource allocation not found")
    
    resource = db.query(Resource).filter(Resource.id == db_allocation.resource_id).first()
    if resource:
        resource.quantity_available += db_allocation.quantity_allocated
    
    db.delete(db_allocation)
    db.commit()
    return None
