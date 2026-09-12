# Clinical Dataset & AI Model Training Guide

This guide provides instructions on how the Machine Learning engine in the **Healthcare Resource Management System** operates, how to add or format clinical datasets, and how to train or retrain the models.

---

## 1. Overview of the AI/ML Architecture

The system features a **Dual-Task Random Forest Machine Learning Ensemble** (`backend/ml/train.py`) developed using **Scikit-Learn**:

1. **Patient Triage Severity Classifier**:
   - Predicts patient urgency level: `Critical`, `High`, `Moderate`, or `Low`.
   - Computes a continuous **Clinical Risk Score** ($0 - 100$) and class probability distribution.
   - Grounded in international emergency medicine protocols: **Emergency Severity Index (ESI)** and **Modified Early Warning Score (MEWS)**.
2. **Critical Resource & Equipment Demand Forecaster**:
   - Predicts what hospital equipment or bed type the patient will require upon admission:
     - `Hamilton C6 Mechanical Ventilator`
     - `ICU Smart Bed - Alpha Unit`
     - `Medical Grade Oxygen Concentrator (50L)`
     - `Philips IntelliVue MX800 Patient Monitor`
     - `Zoll R-Series Defibrillator & Pacer`
     - `GE Healthcare Portable Ultrasound`
     - `General Medical-Surgical Bed`

---

## 2. Dataset Schema & Data Dictionary

The active dataset is located at:
```
backend/data/clinical_admissions.csv
```

### Required Columns

| Column Name | Type | Valid Values / Ranges | Clinical Description |
| :--- | :--- | :--- | :--- |
| `age` | Integer | $1 - 105$ | Patient age in years. |
| `gender` | String | `Male`, `Female`, `Other` | Biological sex of patient. |
| `heart_rate` | Numeric | $30 - 220$ bpm | Pulse rate at triage intake. |
| `systolic_bp` | Numeric | $50 - 250$ mmHg | Systolic blood pressure. |
| `diastolic_bp` | Numeric | $30 - 150$ mmHg | Diastolic blood pressure. |
| `spo2` | Numeric | $50 - 100$ % | Blood oxygen saturation. Critical threshold $< 90\%$. |
| `respiratory_rate` | Numeric | $6 - 60$ breaths/min | Breathing rate per minute. |
| `temperature` | Numeric | $33.0 - 43.0$ °C | Body temperature. |
| `department` | String | Hospital Department | e.g. `Intensive Care Unit (ICU)`, `Cardiology`, `Emergency & Trauma`, `Pulmonology`, `General Medicine` |
| `comorbidities` | String | Clinical history | e.g. `Hypertension`, `Type 2 Diabetes`, `COPD`, `None` |
| `severity_level` *(Target 1)* | String | `Critical`, `High`, `Moderate`, `Low` | Ground-truth triage category. |
| `recommended_resource` *(Target 2)* | String | Resource name | Asset assigned to patient. |

---

## 3. How to Add or Update Datasets

### Method A: Uploading via the Web UI (Easiest)
1. Launch the web application:
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```
2. Navigate to **AI Clinical Foresight** in the left sidebar.
3. Scroll to the **Dataset Management & Continuous Learning** panel.
4. Click **Choose CSV File**, select your dataset, and click **Ingest Dataset & Retrain Model**.
5. The backend will automatically:
   - Validate columns.
   - Train the Random Forest ensemble.
   - Update model weights and telemetry live in the UI.

### Method B: Via CLI Terminal Command
1. Place your CSV file at:
   ```
   backend/data/clinical_admissions.csv
   ```
2. Run the training script:
   ```bash
   python backend/ml/train.py
   ```
3. To re-generate synthetic benchmark data with 2,000+ records:
   ```bash
   python backend/data/generate_dataset.py
   python backend/ml/train.py
   ```

### Method C: Via REST API
Send an HTTP multipart request to the upload endpoint:
```bash
curl -X POST "http://localhost:8000/api/v1/ml/upload-dataset" \
     -H "accept: application/json" \
     -F "file=@your_hospital_data.csv"
```

To trigger retraining of an existing file:
```bash
curl -X POST "http://localhost:8000/api/v1/ml/train"
```

---

## 4. Real-World Datasets (MIMIC-IV, PhysioNet, Kaggle)

If you are using public datasets (e.g. from Kaggle or PhysioNet):
1. **Map Demographics**: Map `Age` and `Gender` to `age` and `gender`.
2. **Map Vitals**: Map `HeartRate` $\rightarrow$ `heart_rate`, `SpO2` $\rightarrow$ `spo2`, `SysBP` $\rightarrow$ `systolic_bp`, `RespRate` $\rightarrow$ `respiratory_rate`, `TempC` $\rightarrow$ `temperature`.
3. **Map Triage Outcomes**:
   - ESI Level 1 $\rightarrow$ `Critical`
   - ESI Level 2 $\rightarrow$ `High`
   - ESI Level 3 $\rightarrow$ `Moderate`
   - ESI Level 4/5 $\rightarrow$ `Low`

---

## 5. Model Architecture & Pipeline Details

- **Preprocessing Pipeline**:
  - `ColumnTransformer` with `StandardScaler` on numerical vitals.
  - `OneHotEncoder(handle_unknown='ignore')` on categorical attributes.
- **Classifier**:
  - `RandomForestClassifier` with $120$ decision trees, balanced class weights, and maximum depth of $12$.
- **Artifacts**:
  - Serialized pipeline: `backend/ml/saved_models/triage_pipeline.joblib`
  - Telemetry & feature weights: `backend/ml/saved_models/model_metadata.json`

---

## 6. Real-Time API Inference Example

You can query the model from any client via `POST /api/v1/ml/predict`:

```json
POST /api/v1/ml/predict
{
  "age": 65,
  "gender": "Female",
  "heart_rate": 138,
  "spo2": 82,
  "systolic_bp": 85,
  "diastolic_bp": 55,
  "respiratory_rate": 34,
  "temperature": 39.4,
  "department": "Intensive Care Unit (ICU)",
  "comorbidities": "COPD"
}
```

**Response**:
```json
{
  "predicted_severity": "Critical",
  "severity_confidence": 1.0,
  "risk_score": 100.0,
  "severity_probabilities": {
    "Critical": 1.0,
    "High": 0.0,
    "Moderate": 0.0,
    "Low": 0.0
  },
  "recommended_resource": "Hamilton C6 Mechanical Ventilator",
  "resource_confidence": 0.958,
  "clinical_warnings": [
    "Severe Hypoxemia (SpO2 82.0%)",
    "Tachycardia (HR 138.0 bpm)",
    "Hypotensive Shock Warning (Systolic 85.0 mmHg)",
    "Tachypnea / Respiratory Strain (34.0 breaths/min)",
    "High Fever / Hyperthermia (39.4 °C)"
  ],
  "clinical_rationale": "Abnormal findings: Severe Hypoxemia (SpO2 82.0%); Tachycardia (HR 138.0 bpm); Hypotensive Shock Warning (Systolic 85.0 mmHg); Tachypnea / Respiratory Strain (34.0 breaths/min); High Fever / Hyperthermia (39.4 °C). Model recommends Critical prioritization and dispatch of Hamilton C6 Mechanical Ventilator."
}
```
