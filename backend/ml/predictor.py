"""
Rural Health & Outbreak Prediction Inference Service.
Loads the trained Random Forest ensemble to forecast 2-week disease spikes,
epidemiological risk levels, and resource dispatch needs.
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any

class RuralHealthPredictor:
    _instance = None

    def __init__(self):
        self.bundle = None
        self.metadata = None
        self.load_models()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = RuralHealthPredictor()
        return cls._instance

    def load_models(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "ml", "saved_models", "rural_health_ensemble.joblib")
        meta_path = os.path.join(base_dir, "ml", "saved_models", "model_metadata.json")

        if os.path.exists(model_path):
            try:
                self.bundle = joblib.load(model_path)
            except Exception as e:
                print(f"Error loading rural health model bundle: {e}")
                self.bundle = None

        if os.path.exists(meta_path):
            try:
                with open(meta_path, "r") as f:
                    self.metadata = json.load(f)
            except Exception as e:
                print(f"Error loading metadata: {e}")
                self.metadata = None

    def is_ready(self) -> bool:
        return self.bundle is not None

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.is_ready():
            self.load_models()
            if not self.is_ready():
                raise RuntimeError("Rural health model not trained. Please execute /api/v1/ml/train.")

        mal_model = self.bundle["malaria_model"]
        dia_model = self.bundle["diarrhea_model"]
        risk_model = self.bundle["risk_model"]
        feature_cols = self.bundle["feature_cols"]

        # Fill defaults for any missing features
        defaults = {
            "rainfall_mm": 15.0,
            "rainfall_anomaly_pct": 10.0,
            "temp_mean_c": 28.5,
            "humidity_pct": 65.0,
            "flood_risk_score": 0.25,
            "rainfall_lag_1w": 12.0,
            "rainfall_lag_2w": 10.0,
            "rainfall_cum_4w": 45.0,
            "vector_breeding_pressure": 2.5,
            "waterborne_runoff_risk": 1.2,
            "population": 3000,
            "tap_water_access_pct": 35.0,
            "sanitation_access_pct": 50.0,
            "distance_phc_km": 7.5,
            "all_weather_road": 1,
            "mo_in_position": 1,
            "anm_present": 1,
            "asha_workers_count": 3,
            "cold_chain_functional": 1,
            "reconstructed_malaria_cases": 2.0,
            "reconstructed_diarrhea_cases": 3.0,
            "spatial_lag_neighbor_malaria": 1.5,
            "spatial_lag_neighbor_diarrhea": 2.0
        }

        row = {}
        for col in feature_cols:
            row[col] = float(input_data.get(col, defaults.get(col, 0.0)))

        df_in = pd.DataFrame([row])

        # Forecast cases
        pred_mal = max(0.0, round(float(mal_model.predict(df_in)[0]), 1))
        pred_dia = max(0.0, round(float(dia_model.predict(df_in)[0]), 1))

        # Predict Risk Tier
        risk_probs = risk_model.predict_proba(df_in)[0]
        risk_classes = risk_model.classes_
        prob_dict = {cls_name: round(float(p), 4) for cls_name, p in zip(risk_classes, risk_probs)}
        predicted_risk = risk_model.predict(df_in)[0]
        risk_conf = prob_dict.get(predicted_risk, 0.8)

        # Calculate Outbreak Hazard Score (0 - 100)
        risk_weight_map = {"Low": 15, "Moderate": 40, "High": 75, "Critical": 100}
        hazard_score = round(sum(prob_dict.get(k, 0.0) * risk_weight_map[k] for k in risk_weight_map), 1)

        # Determine Recommended Resource
        if predicted_risk in ["Critical", "High"] and pred_mal > 6.0:
            recommended_resource = "Antimalarial ACT Treatment Kits & Rapid Diagnostic Kits"
        elif predicted_risk in ["Critical", "High"] and pred_dia > 6.0:
            recommended_resource = "ORS Sachets, IV Saline Fluids & Zinc Formulations"
        elif float(row["waterborne_runoff_risk"]) > 2.0 or float(row["flood_risk_score"]) > 0.4:
            recommended_resource = "Chlorine Disinfection Units & Water Testing Tablets"
        elif int(row["mo_in_position"]) == 0 and predicted_risk in ["Critical", "High"]:
            recommended_resource = "Emergency Mobile Health Van with Medical Officer"
        else:
            recommended_resource = "Community Routine ASHA Surveillance Kits"

        # Formulate Epidemiological Rationale
        warnings = []
        if float(row["flood_risk_score"]) > 0.35:
            warnings.append(f"Elevated Flood Inundation Risk ({round(float(row['flood_risk_score'])*100)}%)")
        if float(row["vector_breeding_pressure"]) > 3.0:
            warnings.append("Surge in Vector Breeding Pressure")
        if pred_mal >= 5.0:
            warnings.append(f"High 2-Week Malaria Influx (+{pred_mal} cases)")
        if pred_dia >= 5.0:
            warnings.append(f"Waterborne Diarrhea Spike (+{pred_dia} cases)")
        if int(row["all_weather_road"]) == 0:
            warnings.append("Village Road Inundated / Difficult Access")
        if int(row["mo_in_position"]) == 0:
            warnings.append("No Medical Officer in Position at Subcentre")

        if warnings:
            rationale = "Epidemiological Alert: " + "; ".join(warnings) + f". Forecast indicates {predicted_risk} outbreak risk. Deploy {recommended_resource} proactively."
        else:
            rationale = f"All climate and disease indicators remain within baseline operating thresholds. Village operating at {predicted_risk} risk."

        return {
            "predicted_malaria_cases_2w": pred_mal,
            "predicted_diarrhea_cases_2w": pred_dia,
            "outbreak_risk_level": predicted_risk,
            "risk_confidence": risk_conf,
            "hazard_score": hazard_score,
            "risk_probabilities": prob_dict,
            "recommended_resource": recommended_resource,
            "epidemiological_warnings": warnings,
            "clinical_warnings": warnings,
            "clinical_rationale": rationale,
            "predicted_severity": predicted_risk,
            "severity_confidence": risk_conf,
            "risk_score": hazard_score
        }

predictor = RuralHealthPredictor.get_instance()
