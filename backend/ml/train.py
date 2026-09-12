"""
Rural Health & Climate-Triangulated Outbreak Forecasting ML Pipeline.
Trains Scikit-Learn multi-task Random Forest models on longitudinal rural health data:
1. 2-Week Lead Malaria Outbreak Regressor
2. 2-Week Lead Diarrhea / Waterborne Outbreak Regressor
3. Outbreak Severity Level Classifier (Critical, High, Moderate, Low)
"""

import os
import json
from datetime import datetime
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import r2_score, mean_absolute_error, accuracy_score, f1_score, classification_report

FEATURE_COLS = [
    "rainfall_mm", "rainfall_anomaly_pct", "temp_mean_c", "humidity_pct", "flood_risk_score",
    "rainfall_lag_1w", "rainfall_lag_2w", "rainfall_cum_4w", "vector_breeding_pressure", "waterborne_runoff_risk",
    "population", "tap_water_access_pct", "sanitation_access_pct", "distance_phc_km", "all_weather_road",
    "mo_in_position", "anm_present", "asha_workers_count", "cold_chain_functional",
    "reconstructed_malaria_cases", "reconstructed_diarrhea_cases",
    "spatial_lag_neighbor_malaria", "spatial_lag_neighbor_diarrhea"
]

def derive_risk_tier(row):
    """Categorize outbreak risk based on climate hazard and 2-week lead disease burden."""
    hazard = row.get("climate_health_hazard_index", 0)
    mal_target = row.get("target_malaria_lead_2w", 0)
    dia_target = row.get("target_diarrhea_lead_2w", 0)

    if hazard >= 24 or mal_target >= 8 or dia_target >= 10:
        return "Critical"
    elif hazard >= 17 or mal_target >= 5 or dia_target >= 6:
        return "High"
    elif hazard >= 11 or mal_target >= 2 or dia_target >= 3:
        return "Moderate"
    return "Low"

def load_dataset(csv_path: str = None):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if csv_path is None:
        csv_path = os.path.join(base_dir, "data", "processed", "climate_triangulated_health_data.csv")
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Processed rural health dataset not found at: {csv_path}")

    df = pd.read_csv(csv_path)
    # Drop rows missing lead-week targets (last 2 weeks of longitudinal series)
    df_clean = df.dropna(subset=["target_malaria_lead_2w", "target_diarrhea_lead_2w"]).copy()
    df_clean["outbreak_risk_level"] = df_clean.apply(derive_risk_tier, axis=1)

    return df_clean

def train_models(dataset_path: str = None):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    saved_models_dir = os.path.join(base_dir, "ml", "saved_models")
    os.makedirs(saved_models_dir, exist_ok=True)

    print("Loading climate-triangulated health dataset...")
    df = load_dataset(dataset_path)
    print(f"Dataset loaded: {len(df)} samples across {df['village_id'].nunique()} villages.")

    X = df[FEATURE_COLS]
    y_malaria = df["target_malaria_lead_2w"]
    y_diarrhea = df["target_diarrhea_lead_2w"]
    y_risk = df["outbreak_risk_level"]

    X_train, X_test, ym_train, ym_test, yd_train, yd_test, yr_train, yr_test = train_test_split(
        X, y_malaria, y_diarrhea, y_risk, test_size=0.20, random_state=42, stratify=y_risk
    )

    # Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[("num", StandardScaler(), FEATURE_COLS)],
        remainder="drop"
    )

    # 1. Malaria 2-Week Lead Regressor
    print("Training 2-Week Lead Malaria Regressor...")
    malaria_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, max_depth=14, random_state=42, n_jobs=-1))
    ])
    malaria_pipeline.fit(X_train, ym_train)
    ym_pred = malaria_pipeline.predict(X_test)
    mal_r2 = float(r2_score(ym_test, ym_pred))
    mal_mae = float(mean_absolute_error(ym_test, ym_pred))

    # 2. Diarrhea 2-Week Lead Regressor
    print("Training 2-Week Lead Diarrhea Regressor...")
    diarrhea_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, max_depth=14, random_state=42, n_jobs=-1))
    ])
    diarrhea_pipeline.fit(X_train, yd_train)
    yd_pred = diarrhea_pipeline.predict(X_test)
    dia_r2 = float(r2_score(yd_test, yd_pred))
    dia_mae = float(mean_absolute_error(yd_test, yd_pred))

    # 3. Outbreak Risk Tier Classifier
    print("Training Outbreak Severity Classifier...")
    risk_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=120, max_depth=12, random_state=42, class_weight="balanced", n_jobs=-1))
    ])
    risk_pipeline.fit(X_train, yr_train)
    yr_pred = risk_pipeline.predict(X_test)
    risk_acc = float(accuracy_score(yr_test, yr_pred))
    risk_f1 = float(f1_score(yr_test, yr_pred, average="weighted"))
    risk_report = classification_report(yr_test, yr_pred, output_dict=True)

    # Feature Importances from the Risk Classifier
    rf_importances = risk_pipeline.named_steps["classifier"].feature_importances_
    sorted_importances = sorted(
        [{"feature": col, "importance": round(float(imp) * 100, 2)} for col, imp in zip(FEATURE_COLS, rf_importances)],
        key=lambda x: x["importance"],
        reverse=True
    )

    # Bundle and save
    bundle = {
        "malaria_model": malaria_pipeline,
        "diarrhea_model": diarrhea_pipeline,
        "risk_model": risk_pipeline,
        "feature_cols": FEATURE_COLS
    }

    model_path = os.path.join(saved_models_dir, "rural_health_ensemble.joblib")
    joblib.dump(bundle, model_path)
    print(f"Trained ensemble saved to: {model_path}")

    metadata = {
        "model_name": "Climate-Triangulated Rural Outbreak Foresight Ensemble",
        "dataset_name": "climate_triangulated_health_data.csv",
        "trained_at": datetime.now().isoformat(),
        "total_samples": len(df),
        "villages_count": int(df["village_id"].nunique()),
        "malaria_forecaster_metrics": {
            "r2_score": round(mal_r2, 3),
            "mae_cases": round(mal_mae, 2)
        },
        "diarrhea_forecaster_metrics": {
            "r2_score": round(dia_r2, 3),
            "mae_cases": round(dia_mae, 2)
        },
        "outbreak_classifier_metrics": {
            "accuracy": round(risk_acc * 100, 2),
            "weighted_f1": round(risk_f1 * 100, 2),
            "classes": risk_pipeline.classes_.tolist(),
            "classification_report": risk_report
        },
        "feature_importances": sorted_importances[:10]
    }

    meta_path = os.path.join(saved_models_dir, "model_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {meta_path}")

    print("\n=== Model Training Summary ===")
    print(f"Malaria Forecast R2: {mal_r2:.3f} | MAE: {mal_mae:.2f} cases")
    print(f"Diarrhea Forecast R2: {dia_r2:.3f} | MAE: {dia_mae:.2f} cases")
    print(f"Outbreak Classification Accuracy: {risk_acc * 100:.2f}% | F1: {risk_f1 * 100:.2f}%")
    print("\nTop 5 Disease Drivers:")
    for fi in sorted_importances[:5]:
        print(f" - {fi['feature']}: {fi['importance']}%")

    return metadata

if __name__ == "__main__":
    train_models()
