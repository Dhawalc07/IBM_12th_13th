"""
API Router for Clinical Foresight Machine Learning Endpoints
Handles real-time inference, model evaluation telemetry, dataset upload, and automated retraining.
"""

import os
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from backend.schemas import MLPredictionInput, MLPredictionResponse, ModelMetadataResponse
from backend.ml.predictor import predictor
from backend.ml.train import train_models

router = APIRouter(prefix="/ml", tags=["machine-learning"])


@router.get("/model-info", response_model=ModelMetadataResponse)
def get_model_info():
    """Retrieve model training status, architecture, evaluation metrics, and feature importances."""
    if not predictor.is_ready():
        predictor.load_models()
        
    if not predictor.is_ready():
        return {
            "status": "not_trained",
            "metadata": None
        }
        
    return {
        "status": "ready",
        "metadata": predictor.metadata
    }


@router.post("/predict", response_model=MLPredictionResponse)
def predict_triage(payload: MLPredictionInput):
    """Run real-time inference on patient physiological vitals to predict triage severity and equipment need."""
    try:
        result = predictor.predict(payload.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@router.post("/train")
def retrain_model():
    """Trigger retraining of the Random Forest ensemble on the current clinical dataset."""
    try:
        metadata = train_models()
        predictor.load_models()
        return {
            "status": "success",
            "message": "Model retrained and reloaded into memory successfully.",
            "metrics": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")


@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload a custom CSV dataset file to replace the active training dataset and re-train the model."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV dataset files are supported.")
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dest_path = os.path.join(base_dir, "data", "clinical_admissions.csv")
    backup_path = os.path.join(base_dir, "data", "clinical_admissions_backup.csv")
    
    # Backup current dataset if exists
    if os.path.exists(dest_path):
        shutil.copyfile(dest_path, backup_path)
        
    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Retrain on the newly uploaded dataset
        metadata = train_models(dataset_path=dest_path)
        predictor.load_models()
        
        return {
            "status": "success",
            "message": f"Dataset '{file.filename}' uploaded and model successfully trained on new data.",
            "metrics": metadata
        }
    except Exception as e:
        # Restore backup if error occurred
        if os.path.exists(backup_path):
            shutil.copyfile(backup_path, dest_path)
        predictor.load_models()
        raise HTTPException(status_code=400, detail=f"Dataset processing or training failed: {str(e)}")
