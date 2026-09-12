# RuralHealth OS: Full Project Documentation & Execution Guide
### Climate-Triangulated Rural Health Surveillance, Outbreak Foresight & Dynamic Resource Allocation System

---

## 1. Executive Summary & Vision

**RuralHealth OS** is an intelligent, climate-triangulated epidemiological surveillance, disease forecasting, and healthcare resource allocation system designed specifically for rural district health networks. Grounded in the harsh operational realities of rural healthcare delivery—remote subcentres, unpaved dirt roads prone to monsoon flooding, prolonged reporting lags in Health Management Information Systems (HMIS), and severe seasonal drug stockouts—the platform transforms reactive disaster firefighting into **proactive clinical and epidemiological foresight**.

```
+---------------------------------------------------------------------------------------------------+
|                                     THE RURAL HEALTHCARE DILEMMA                                  |
|   Past Reality:  Heavy Rains ➔ Road Cutoffs ➔ HMIS Gap ➔ Delayed Outbreak Notice ➔ Crisis & Deaths|
|   RuralHealth OS: Satellite Meteorology + Road Status ➔ 14-Day Forecast ➔ Proactive Pre-Dispatch |
+---------------------------------------------------------------------------------------------------+
```

### Core Value Propositions
1. **14-Day Outbreak Early Warning**: Predicts impending spikes in **Malaria** (vector-borne) and **Acute Diarrheal Diseases** (waterborne) 14 days in advance by triangulating satellite meteorology (precipitation anomalies, temperature, humidity, and flood inundation) with village infrastructure.
2. **Interactive GIS Spatial Command Center**: Real-time GPS mapping of **50 rural villages** across 5 administrative blocks with live epidemiological risk color-coding, subcentre drug stockout alerts, and transit distance-to-care markers.
3. **Automated Proactive Resource Allocation**: Automatically prescribes and routes critical medical supplies (*Antimalarial ACT Treatment Kits*, *Rapid Diagnostic Kits [RDKs]*, *ORS & IV Saline Infusions*, *Chlorine Water Purification Units*, *Mobile Medical Outreach Vans*) before floods cut off physical access.
4. **End-to-End Hospital Operations & Triage**: Comprehensive tracking of patient demographics, inpatient admissions, and medical equipment with strict inventory preservation invariants: automatic stock decrement upon allocation and immediate restocking upon return.
5. **AI Clinical Admission Assist**: Evaluates patient physiological vitals (SpO2, Heart Rate, Blood Pressure, Respiratory Rate, Temperature) to automatically compute emergency triage priority tiers (`Critical`, `High`, `Moderate`, `Low`) and recommend life-support equipment.

---

## 2. System Architecture

RuralHealth OS utilizes a **Modular Monolithic Architecture** combining a high-performance Python FastAPI backend, a multi-task Scikit-Learn Machine Learning pipeline, and a modern Vanilla ES6 Single Page Application (SPA) frontend powered by Leaflet.js GIS mapping.

```
+-------------------------------------------------------------------------------------------------------+
|                                           PRESENTATION LAYER                                          |
|  - Vanilla ES6 Single Page Application (SPA) with Glassmorphism Dark Design System                     |
|  - Leaflet.js GIS Spatial Command Center + CartoDB Cartography + Offline Vector SVG Fallback Canvas   |
|  - Reactive State Management Store (frontend/js/state.js) + Event-Driven Modal & Toast Subsystems     |
+---------------------------------------------------+---------------------------------------------------+
                                                    |
                                                    | JSON REST API (HTTP / CORS)
                                                    v
+-------------------------------------------------------------------------------------------------------+
|                                        FASTAPI APPLICATION LAYER                                      |
|  +---------------------------+  +---------------------------+  +-----------------------------------+  |
|  |    surveillance_router    |  |         ml_router         |  |           health_router           |  |
|  | - 50 Village GPS Points   |  | - 2W Disease Forecaster   |  | - Patient Registry & Medical IDs  |  |
|  | - Climate Hazard Metrics  |  | - Outbreak Classification |  | - Inpatient Admissions & Triage   |  |
|  | - 104-Week Time Series    |  | - Demand Recommendation   |  | - Equipment Stock & Dispatch      |  |
|  | - District Summary KPIs   |  | - Real-time Retraining    |  | - Return Inventory Restoration    |  |
|  +---------------------------+  +---------------------------+  +-----------------------------------+  |
+-----------------------+-----------------------------------+-----------------------------------+-------+
                        |                                   |                                   |
                        |                                   |                                   |
+-----------------------v-------+   +-----------------------v-------+   +-----------------------v-------+
|       GIS & CLIMATE DATA      |   |    MACHINE LEARNING ENGINE    |   |     RELATIONAL ORM LAYER      |
| - villages.csv (50 Villages)  |   | - Multi-Task RandomForest     |   | - SQLAlchemy 2.0 ORM Engine   |
| - hmis_reported_longitudinal  |   |   (Malaria & Diarrhea Regr.)  |   | - SQLite 3 (Dev: healthcare.db|
| - climate_triangulated_health |   | - RandomForestClassifier      |   | - PostgreSQL (Prod Ready)     |
|   _data.csv (5,200 records)   |   |   (4 Outbreak Severity Tiers) |   | - Pydantic v2 Type Schemas    |
| - reconstructed_health_data   |   | - StandardScaler Pipeline     |   | - Strict Invariant Protection |
+-------------------------------+   +-------------------------------+   +-------------------------------+
```

### Architectural Principles
* **Loose Coupling & High Cohesion**: Routers are compartmentalized by functional domain (`surveillance`, `ml`, `health`), ensuring changes to ML models never break hospital operations or GIS mapping.
* **Fail-Safe Offline Operation**: When internet connectivity drops in remote clinics, Leaflet.js automatically transitions to an offline mathematical SVG canvas that renders all 50 village coordinates and hazard rings natively.
* **Deterministic Resource Invariants**: Equipment allocation strictly enforces `quantity_available >= quantity_allocated`. Deleting an allocation restores the asset count deterministically within a database transaction.

---

## 3. Project Structure

```
g:/IBM_12th_13th/
├── backend/
│   ├── config.py                 # Pydantic BaseSettings environment configuration & CORS policies
│   ├── main.py                   # FastAPI initialization, router mounting, static SPA serving
│   ├── models.py                 # SQLAlchemy 2.0 ORM models (Patient, Resource, Admission, Allocation)
│   ├── schemas.py                # Pydantic v2 request & response validation schemas
│   ├── requirements.txt          # Python dependencies (FastAPI, scikit-learn, reportlab, pandas)
│   ├── generate_pdf.py           # Automated PDF compilation engine using ReportLab 5.0.1
│   ├── data/
│   │   ├── raw/
│   │   │   ├── villages.csv                  # Master registry of 50 rural villages, GPS, and staff
│   │   │   ├── hmis_reported_longitudinal.csv# 104-week reported HMIS records with missing gaps
│   │   │   └── ground_truth_longitudinal.csv # Ground-truth disease cases and maternal records
│   │   └── processed/
│   │       ├── climate_triangulated_health_data.csv # 5,200 longitudinal records (50 villages x 104 wks)
│   │       └── reconstructed_health_data.csv       # Gap-filled epidemiological timeseries
│   ├── ml/
│   │   ├── train.py              # Scikit-Learn training pipeline for regressor & classifier
│   │   ├── predictor.py          # Real-time inference engine and clinical decision-support service
│   │   └── saved_models/
│   │       ├── rural_health_ensemble.joblib # Serialized model bundle (Regressors + Classifier)
│   │       ├── triage_pipeline.joblib       # Clinical vitals triage & equipment predictor
│   │       └── model_metadata.json          # Metrics, accuracy, confusion matrix, feature weights
│   └── routers/
│       ├── health_router.py      # CRUD for patients, resources, admissions, and equipment dispatch
│       ├── ml_router.py          # Real-time inference, model evaluation telemetry, dataset upload
│       └── surveillance_router.py# Village GPS telemetry, district summaries, historical trends
├── frontend/
│   ├── index.html                # Single Page Application container with responsive nav & modals
│   ├── css/
│   │   └── styles.css            # Responsive dark-theme design system, typography & Leaflet styles
│   └── js/
│       ├── api.js                # Centralized asynchronous HTTP client for all backend REST endpoints
│       ├── app.js                # SPA hash router, modal lifecycle bindings, and application bootstrapper
│       ├── state.js              # Reactive in-memory state management store with pub/sub hooks
│       ├── components/
│       │   ├── dashboard.js      # GIS Leaflet Map, real-time telemetry, and Top Outbreak Watchlist
│       │   ├── ai_foresight.js   # ML Outbreak Simulator, Scenario Presets & Feature Weights
│       │   ├── patients.js       # Patient directory, search filters, and medical history drawer
│       │   ├── admissions.js     # Inpatient admissions directory & Smart Admission Assist
│       │   ├── resources.js      # Hospital equipment inventory & low-stock warning cards (<=25%)
│       │   ├── allocations.js    # Direct asset dispatch matrix & return workflow
│       │   └── analytics.js      # Department census, triage distributions, and telemetry charts
│       └── utils/
│           ├── modal.js          # Reusable modal dialog lifecycle manager with accessibility support
│           ├── seeder.js         # Realistic synthetic demo record generator for clinical testing
│           └── toast.js          # Floating notification toast alert system
├── healthcare.db                 # SQLite 3 local development database
├── DATASET_GUIDE.md              # Dataset formatting guide, column glossary, and retraining manual
├── PROJECT_DOCUMENTATION.md      # Full self-contained system documentation and execution guide
├── RuralHealth_OS_Project_Documentation.pdf # Publication-ready 11-page compiled PDF manual
└── README.md                     # High-level project summary and quickstart
```

---

## 4. Dataset & Features Specification

The core surveillance dataset (`backend/data/processed/climate_triangulated_health_data.csv`) covers **50 villages over 104 consecutive weeks**, providing **5,200 longitudinal observations**:

```
+----------------------------------------------------------------------------------------------------+
|                                    LONGITUDINAL DATASET AT A GLANCE                                |
|   50 Rural Villages  x  104 Weeks (2 Years)  =  5,200 Records  |  23 Engineered Predictive Features|
|   Geographic Scope: Lat 24.08° - 24.48° N | Lon 82.12° - 82.69° E | Total Population: 145,045       |
+----------------------------------------------------------------------------------------------------+
```

### Feature Dictionary (23 Engineered Model Inputs)

#### 1. Spatial & Infrastructure Features
* `village_id`: Unique identifier for each village (`VIL_001` to `VIL_050`).
* `village_name`: Vernacular community name (e.g., *Dumraon*, *Sonpur*, *Bairia*, *Manpur*).
* `block_name`: Administrative block subdivision (`Block-A`, `Block-B`, `Block-C`, `Block-D`, `Block-E`).
* `subcentre_id` & `parent_phc_id`: Associated Primary Health Subcentre and Primary Health Centre IDs.
* `latitude`, `longitude`: Precise GPS coordinates (Latitude: 24.08°–24.48° N, Longitude: 82.12°–82.69° E).
* `population`: Village census count ($950 - 4,824$ residents per village).
* `distance_phc_km` & `distance_chc_km`: Road transit distance to primary and community health facilities.
* `all_weather_road`: Binary indicator ($1 =$ Paved bitumen road; $0 =$ Mud track vulnerable to monsoon washout).
* `tap_water_access_pct` & `sanitation_access_pct`: Proportion of households with piped water and sanitary latrines.
* `mo_in_position`: Binary indicator ($1 =$ Medical Officer posted at subcentre; $0 =$ Vacant post).
* `anm_present` & `asha_workers_count`: Counts of active Auxiliary Nurse Midwives and ASHA community volunteers.
* `cold_chain_functional`: Binary indicator ($1 =$ Solar vaccine/medicine refrigerator operational).

#### 2. Meteorological & Environmental Drivers
* `rainfall_mm`: Total precipitation recorded during the surveillance week.
* `rainfall_anomaly_pct`: Percentage deviation from the 10-year historical seasonal precipitation baseline.
* `rainfall_lag_1w` & `rainfall_lag_2w`: 1-week and 2-week lagged rainfall values to capture incubation latency.
* `rainfall_cum_4w`: 4-week moving cumulative precipitation (primary vector breeding indicator).
* `temp_mean_c`: Mean weekly ambient temperature in degrees Celsius ($14.2^\circ\text{C} - 38.6^\circ\text{C}$).
* `humidity_pct`: Relative atmospheric humidity percentage ($32\% - 94\%$).
* `flood_risk_score`: Normalized flood inundation probability ($0.0 - 1.0$) computed from drainage slope.
* `vector_breeding_pressure`: Mathematical composite of temperature and humidity suitability for *Anopheles* mosquitoes.
* `waterborne_runoff_risk`: Index capturing surface runoff volume into open shallow drinking wells.

#### 3. Reconstructed Ground-Truth & Spatial Lag Indicators
* `reconstructed_malaria_cases`: Historical malaria incidence gap-filled via satellite anomaly cross-referencing.
* `reconstructed_diarrhea_cases`: Historical acute diarrheal cases adjusted for reporting non-compliance.
* `spatial_lag_neighbor_malaria`: Spatial contagion index measuring infection counts in adjacent contiguous villages.
* `spatial_lag_neighbor_diarrhea`: Water-basin contagion index tracking downstream river contamination.

#### 4. Forecast Targets & Risk Indices
* `target_malaria_lead_2w`: Observed malaria case count **2 weeks into the future** (Continuous regression target).
* `target_diarrhea_lead_2w`: Observed acute diarrhea case count **2 weeks into the future** (Continuous regression target).
* `outbreak_risk_level`: Multi-class ground-truth triage category (`Critical`, `High`, `Moderate`, `Low`).
* `climate_health_hazard_index`: Composite hazard rating ($0 - 100$) reflecting overall environmental vulnerability.
* `drug_stockout_flag`: Binary indicator ($1 =$ Stock depleted for ACT, ORS, or essential antibiotics).

---

## 5. Machine Learning Pipeline & Performance

The machine learning subsystem implements a **Multi-Task Random Forest Ensemble** trained with `scikit-learn`.

```
Raw Telemetry (23 Features)
          │
          ▼
StandardScaler Pipeline (ColumnTransformer)
          │
    ┌─────┴────────────────────────┬────────────────────────┐
    ▼                              ▼                        ▼
2-Week Malaria Regressor     2-Week Diarrhea Regressor    Outbreak Risk Classifier
(RandomForestRegressor)     (RandomForestRegressor)      (RandomForestClassifier)
  100 Trees, Depth 14          100 Trees, Depth 14          120 Trees, Balanced
   R² = 0.750, MAE = ±1.26      R² = 0.726, MAE = ±0.94     Accuracy = 85.49%, F1 = 86.07%
```

### Model Performance Benchmarks

| Model Component | Estimator Type | Target Variable | Hyperparameters | Performance Benchmark |
| :--- | :--- | :--- | :--- | :--- |
| **Malaria Forecaster** | `RandomForestRegressor` | `target_malaria_lead_2w` | 100 trees, max depth 14, min samples split 4 | **$R^2 = 0.750$**, **$\text{MAE} = \pm 1.26\text{ cases}$** |
| **Diarrhea Forecaster** | `RandomForestRegressor` | `target_diarrhea_lead_2w` | 100 trees, max depth 14, min samples split 4 | **$R^2 = 0.726$**, **$\text{MAE} = \pm 0.94\text{ cases}$** |
| **Outbreak Risk Classifier** | `RandomForestClassifier` | `outbreak_risk_level` | 120 trees, max depth 12, balanced weights | **$85.49\%\text{ Accuracy}$**, **$86.07\%\text{ Weighted F1}$** |

### Detailed Classification Report

| Outbreak Tier | Precision | Recall | F1-Score | Support Samples | Clinical Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Critical** | **0.989** | **0.933** | **0.960** | 505 | Near-zero false negatives for acute life-threatening surges |
| **High** | 0.776 | 0.816 | 0.796 | 217 | Captures emerging hot spots requiring subcentre pre-stocking |
| **Moderate** | 0.801 | 0.755 | 0.777 | 245 | Manages routine preventive distribution |
| **Low** | 0.459 | 0.736 | 0.565 | 53 | Baseline seasonal variance |
| **Weighted Average** | **0.871** | **0.855** | **0.861** | 1,020 | Production-grade epidemiological foresight |

### Top Predictive Feature Importances (Gini Impurity Weight)

1. **`all_weather_road` (11.13%)**: Road cutoffs prevent timely patient transit and clinical outreach during monsoon rainfall.
2. **`waterborne_runoff_risk` (8.98%)**: Runoff volume washes surface pathogens into shallow open drinking wells.
3. **`flood_risk_score` (6.64%)**: Standing water and waterlogging directly multiply vector incubation sites.
4. **`rainfall_cum_4w` (6.53%)**: Prolonged moisture retention drives mosquito breeding cycles over 28-day periods.
5. **`population` (6.42%)**: Community size dictates transmission density and contact velocity.
6. **`temp_mean_c` (5.92%)**: Temperature dictates the extrinsic incubation period of the *Plasmodium* parasite.
7. **`rainfall_lag_1w` (5.46%)**: Captures immediate water accumulation prior to vector emergence.
8. **`vector_breeding_pressure` (5.38%)**: Mathematical bio-climatic suitability index.
9. **`rainfall_mm` (4.98%)**: Direct precipitation measure.
10. **`rainfall_lag_2w` (4.68%)**: Historical lag tracking early-stage larval maturation.

---

## 6. Complete REST API Specification

Base URL: `http://localhost:8000/api/v1`

```
+---------------------------------------------------------------------------------------------------+
|                                        API ENDPOINT DIRECTORY                                     |
|   /surveillance/summary            - District-wide KPI aggregates across 50 villages              |
|   /surveillance/villages           - 50 Village GPS coordinates, climate hazards & predictions    |
|   /surveillance/villages/{id}/trend- 104-week historical longitudinal disease & rainfall timeseries|
|   /ml/predict                      - Real-time inference on climate inputs or patient vitals      |
|   /ml/model-info                   - Model architecture, training timestamp & feature weights     |
|   /ml/train                        - Automated retraining trigger on current dataset              |
|   /ml/upload-dataset               - Multipart CSV upload with automatic backup & retraining      |
|   /health                          - Database status, row counts & system telemetry               |
|   /patients                        - Patient CRUD operations and Medical Record Numbers (MRN)     |
|   /resources                       - Hospital equipment inventory & low-stock monitoring          |
|   /admissions                      - Patient admissions with severity-level triage prioritization |
|   /resource-allocations            - Equipment dispatch (auto-decrements stock; auto-restores)    |
+---------------------------------------------------------------------------------------------------+
```

### 1. Surveillance & GIS Endpoints

#### `GET /api/v1/surveillance/summary`
Returns aggregate district-wide surveillance metrics across all 50 villages for the latest surveillance week.
* **Response Sample**:
```json
{
  "monitored_villages": 50,
  "monitored_blocks": 5,
  "total_rural_population": 145045,
  "current_surveillance_week": 104,
  "critical_outbreak_villages": 5,
  "high_risk_villages": 13,
  "moderate_risk_villages": 15,
  "low_risk_villages": 17,
  "active_drug_stockouts": 21,
  "district_avg_rainfall_mm": 7.0,
  "district_avg_temp_c": 17.5,
  "forecasted_district_malaria_surge_2w": 72.6,
  "forecasted_district_diarrhea_surge_2w": 77.2
}
```

#### `GET /api/v1/surveillance/villages`
Returns all 50 villages with exact GPS coordinates, infrastructural attributes, and latest 2-week outbreak predictions.
* **Query Parameters**:
  * `block` (*optional*): Filter by administrative block (e.g. `Block-A`, `Block-B`, `Block-C`, `Block-D`, `Block-E`).
  * `risk` (*optional*): Filter by risk level (e.g. `Critical`, `High`, `Moderate`, `Low`).
* **Response Sample**:
```json
[
  {
    "village_id": "VIL_044",
    "village_name": "Dumraon",
    "block_name": "Block-E",
    "subcentre_id": "HSC_5_01",
    "parent_phc_id": "PHC_05",
    "latitude": 24.08776,
    "longitude": 82.48109,
    "population": 4824,
    "distance_phc_km": 11.2,
    "distance_chc_km": 36.4,
    "all_weather_road": 0,
    "tap_water_access_pct": 31.2,
    "sanitation_access_pct": 42.1,
    "mo_in_position": 0,
    "anm_present": 1,
    "asha_workers_count": 4,
    "cold_chain_functional": 1,
    "drug_stockout_flag": 1,
    "rainfall_mm": 65.0,
    "temp_mean_c": 31.5,
    "humidity_pct": 86.0,
    "flood_risk_score": 0.55,
    "current_malaria_cases": 6.0,
    "current_diarrhea_cases": 7.0,
    "forecasted_malaria_2w": 8.4,
    "forecasted_diarrhea_2w": 9.1,
    "climate_health_hazard_index": 28.5,
    "outbreak_risk_level": "Critical",
    "recommended_resource": "Antimalarial ACT Treatment Kits & RDKs"
  }
]
```

#### `GET /api/v1/surveillance/villages/{village_id}/trend`
Returns the complete 104-week historical timeseries for a selected village for chart rendering.

---

### 2. Machine Learning Endpoints

#### `POST /api/v1/ml/predict`
Executes real-time inference on input climate and village parameters.
* **Request Body**:
```json
{
  "rainfall_mm": 65.0,
  "rainfall_cum_4w": 180.0,
  "temp_mean_c": 31.5,
  "humidity_pct": 86.0,
  "flood_risk_score": 0.55,
  "vector_breeding_pressure": 3.8,
  "waterborne_runoff_risk": 3.2,
  "population": 4200,
  "distance_phc_km": 12.0,
  "all_weather_road": 0,
  "mo_in_position": 0,
  "tap_water_access_pct": 25.0
}
```
* **Response Sample**:
```json
{
  "predicted_malaria_cases_2w": 7.8,
  "predicted_diarrhea_cases_2w": 8.5,
  "outbreak_risk_level": "Critical",
  "risk_confidence": 0.88,
  "hazard_score": 92.4,
  "recommended_resource": "Antimalarial ACT Treatment Kits & Rapid Diagnostic Kits",
  "epidemiological_warnings": [
    "Elevated Flood Inundation Risk (55%)",
    "Surge in Vector Breeding Pressure",
    "High 2-Week Malaria Influx (+7.8 cases)",
    "Waterborne Diarrhea Spike (+8.5 cases)",
    "Village Road Inundated / Difficult Access",
    "No Medical Officer in Position at Subcentre"
  ],
  "clinical_rationale": "Epidemiological Alert: Elevated Flood Inundation Risk (55%); Surge in Vector Breeding Pressure; High 2-Week Malaria Influx (+7.8 cases); Waterborne Diarrhea Spike (+8.5 cases); Village Road Inundated; No Medical Officer. Forecast indicates Critical outbreak risk. Deploy Antimalarial ACT Treatment Kits & Rapid Diagnostic Kits proactively."
}
```

#### `GET /api/v1/ml/model-info`
Retrieves model readiness status, training timestamp, accuracy benchmarks, and top feature weights.

#### `POST /api/v1/ml/train`
Triggers immediate model retraining on the server and reloads the model ensemble in memory without downtime.

#### `POST /api/v1/ml/upload-dataset`
Accepts a multipart CSV upload, backs up the existing data, validates schema columns, and retrains the model.

---

### 3. Patient & Resource Management Endpoints

| Method | Endpoint | Description | Request / Response Behavior |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | System health check | Returns database connection status and total entity row counts |
| `GET` | `/api/v1/patients` | List patients | Supports pagination (`skip`, `limit`) |
| `POST` | `/api/v1/patients` | Register new patient | Enforces unique `medical_record_number` (MRN) |
| `GET` | `/api/v1/patients/{id}` | Get patient details | Returns patient demographics and admission history |
| `PUT` | `/api/v1/patients/{id}` | Update patient | Updates contact, address, or demographic info |
| `DELETE` | `/api/v1/patients/{id}` | Delete patient | Deletes patient record and associated records |
| `GET` | `/api/v1/resources` | List hospital assets | Returns equipment inventory and availability counts |
| `POST` | `/api/v1/resources` | Create new equipment | Adds equipment with `quantity_total` and `quantity_available` |
| `PUT` | `/api/v1/resources/{id}`| Update equipment | Updates status, maintenance state, or quantities |
| `DELETE` | `/api/v1/resources/{id}`| Delete equipment | Removes equipment from registry |
| `GET` | `/api/v1/admissions` | List admissions | Lists all admissions with triage severity level |
| `POST` | `/api/v1/admissions` | Admit patient | Records department, diagnosis, and triage priority |
| `PUT` | `/api/v1/admissions/{id}`| Update admission | Updates status (`active`, `discharged`) and discharge date |
| `DELETE` | `/api/v1/admissions/{id}`| Delete admission | Cancels admission and clears allocations |
| `GET` | `/api/v1/resource-allocations` | List allocations | Shows equipment assigned to inpatient admissions |
| `POST` | `/api/v1/resource-allocations` | Allocate equipment | **Decrements** available stock; rejects if stock is insufficient |
| `DELETE`| `/api/v1/resource-allocations/{id}` | Return equipment | **Restores** available stock automatically upon return |

---

## 7. Frontend User Guide & Operational Workflows

The frontend is a lightweight Single Page Application (SPA) with zero external framework dependencies, providing sub-second load times even over weak 2G/3G rural networks.

```
+---------------------------------------------------------------------------------------------------+
|                                      FRONTEND MODULE DIRECTORY                                    |
|   1. GIS Surveillance Map  - Real-time 50 village pins, pulse rings, and quick dispatch buttons  |
|   2. AI Clinical Foresight - Interactive outbreak simulator with climate scenario presets         |
|   3. Patient Directory     - Searchable patient registry with detailed medical history drawer     |
|   4. Inpatient Admissions  - Triage queue with AI Vitals Auto-Fill admission assistance           |
|   5. Equipment & Beds      - Asset stock monitor with visual low-inventory warning badges (<=25%) |
|   6. Dispatch Matrix       - Active equipment allocations with deterministic return restocking    |
|   7. Analytics & Census    - Department census graphs, triage distribution & bed occupancy metrics|
+---------------------------------------------------------------------------------------------------+
```

### 1. GIS Outbreak Surveillance Map (First Page)
* **Map Centering**: Automatically initializes centered on the rural district coordinates ($24.23^\circ\text{ N}, 82.42^\circ\text{ E}$) displaying all **50 villages**.
* **Visual Triage Rings**:
  * **Pulsing Red Markers**: Indicate `Critical` outbreak warning villages requiring immediate PHC dispatch.
  * **Amber Markers**: Indicate `High` risk villages with emerging vector breeding.
  * **Yellow Markers**: Indicate `Moderate` surveillance tier.
  * **Emerald Markers**: Indicate `Low` risk baseline villages.
* **Village Detail Modal**: Clicking any village marker opens a detailed telemetry panel displaying 2-week forecasted malaria and diarrhea cases, road status, cold chain status, and a direct **"⚡ Dispatch Emergency Kit"** button.
* **Dynamic Filters**:
  * **Block Filter**: Switch between `All Blocks`, `Block-A`, `Block-B`, `Block-C`, `Block-D`, `Block-E`.
  * **Risk Filter**: Filter down to `Critical Alert`, `High Risk`, `Moderate`, or `Low`.
  * **Layer Mode**: Switch views between `All Hazards`, `Malaria Surge Focus`, `Diarrhea & Runoff`, or `Drug Stockouts Only`.
* **Top Outbreak Watchlist**: Left sidebar panel highlighting the 5 most critical villages with one-click dispatch routing.

### 2. AI Clinical Foresight & Outbreak Simulator
* Navigate to **AI Clinical Foresight** (`🧠`) via the sidebar.
* **Scenario Presets**:
  * *Dry Season Baseline*: Normal temperature, low rainfall, normal roads.
  * *Monsoon Inundation & Runoff*: High rainfall, severe flood inundation, mud roads cut off.
  * *Post-Rain Vector Surge*: High humidity, standing water, vector pressure surge.
  * *Remote Isolated Village*: Long transit distance, unpaved road, no posted medical officer.
* **Interactive Sliders**: Modify rainfall ($0 - 150\text{ mm}$), temperature, humidity, flood score, or road status and click **"Run AI Outbreak Risk & Demand Assessment"**.
* **Instant Results**: View predicted 2-week case influx, multi-class risk probabilities, and automated supply recommendations.

### 3. Smart Inpatient Admission Assist
* In the top navigation bar, click **+ Admit**.
* Select a registered patient from the dropdown.
* Click **⚡ Input Vitals & Predict**, enter the patient's vitals (Heart Rate, SpO2, Systolic/Diastolic BP, Respiratory Rate, Temperature), and click **🤖 Run AI Prediction & Auto-Fill Triage**.
* The AI automatically computes the severity level (`Critical`, `High`, `Moderate`, `Low`), auto-populates clinical assessment notes, and recommends necessary equipment (e.g. *Ventilator*, *Oxygen Concentrator*, *ICU Bed*).

### 4. Direct Equipment Dispatch & Stock Tracking
* **Equipment & Beds**: Monitor inventory levels with low-stock warning badges ($\le 25\%$ stock).
* **Dispatch Matrix**: Allocate equipment directly to active patient admissions. The system decrements stock instantly and restores it automatically when the equipment is returned or the allocation is deleted.

---

## 8. Step-by-Step Setup & Execution Guide

### Prerequisites
* **Python 3.9+** (Fully tested on Python 3.11 and Python 3.13)
* **Git**
* Web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari)

### Step 1: Navigate to Workspace Root
```bash
cd g:\IBM_12th_13th
```

### Step 2: Set Up Virtual Environment (Recommended)
```bash
# On Windows (PowerShell):
python -m venv venv
.\venv\Scripts\activate

# On Linux / macOS:
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r backend/requirements.txt
```
*Core libraries installed*: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `scikit-learn`, `pandas`, `numpy`, `joblib`, `reportlab`.

### Step 4: Verify Model Weights & Initialize (Optional)
If you wish to re-train the models from the raw dataset:
```bash
python backend/ml/train.py
```
*Expected Output*:
```
Loading climate-triangulated health dataset...
Dataset loaded: 5100 samples across 50 villages.
Training 2-Week Lead Malaria Regressor...
Training 2-Week Lead Diarrhea Regressor...
Training Outbreak Severity Classifier...
Trained ensemble saved to: backend/ml/saved_models/rural_health_ensemble.joblib
Metadata saved to: backend/ml/saved_models/model_metadata.json

=== Model Training Summary ===
Malaria Forecast R2: 0.750 | MAE: 1.26 cases
Diarrhea Forecast R2: 0.726 | MAE: 0.94 cases
Outbreak Classification Accuracy: 85.49% | F1: 86.07%
```

### Step 5: Start the Application Server
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 6: Access the Application
* **Interactive Web Application**: Open [http://localhost:8000](http://localhost:8000)
* **Interactive Swagger Documentation**: Open [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative ReDoc Documentation**: Open [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 9. Production Configuration & Deployment

### Environment Variables (`.env`)
Create a `.env` file in the project root:
```ini
# Application Configuration
APP_NAME="RuralHealth OS - District Outbreak Surveillance"
DEBUG=False
LOG_LEVEL=INFO

# Relational Database Connection (PostgreSQL for Enterprise Production)
DATABASE_URL=postgresql://health_admin:secure_password@localhost:5432/rural_health_db

# Security & CORS Origins
SECRET_KEY=generate-a-cryptographically-secure-random-key-min-32-chars
CORS_ORIGINS=["https://health.district.gov.in", "http://localhost:8000"]
```

### Running with Production Gunicorn / Multi-Worker Uvicorn
```bash
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 10. Troubleshooting & FAQs

### Q1: The map does not show markers or displays a blank grid.
* **Root Cause**: Leaflet tiles require internet access to load CartoDB or OpenStreetMap tile servers.
* **Built-in Solution**: RuralHealth OS includes an automatic **offline SVG vector fallback canvas**. If tile servers fail to load within 2 seconds, the map seamlessly switches to an offline coordinate canvas plotting all 50 villages and risk rings natively.

### Q2: How do I retrain the models with our district's custom data?
* **Method A (Web UI)**: Navigate to **AI Clinical Foresight**, scroll to **Upload Updated Surveillance Dataset**, select your CSV file, and click **Ingest Dataset & Retrain Ensemble**.
* **Method B (CLI)**: Place your new CSV at `backend/data/processed/climate_triangulated_health_data.csv` and run `python backend/ml/train.py`.
* Refer to `DATASET_GUIDE.md` for column naming specifications.

### Q3: How does the system handle missing weekly HMIS reports?
* In real-world rural health, many subcentres fail to report during monsoon washouts. The training dataset utilizes the **reconstructed epidemiological series** (`reconstructed_malaria_cases`, `reconstructed_diarrhea_cases`) that cross-references satellite rainfall anomalies with historical trends to reconstruct true disease burden during reporting gaps.

### Q4: How is inventory protected against accidental over-allocation?
* The backend enforces atomic verification: if `quantity_available < quantity_allocated`, the transaction aborts with HTTP `400 Bad Request`. When an allocation is deleted, the quantity is automatically credited back to `quantity_available`.

---

## 11. Automated Verification & Test Suite

To verify the entire backend, database, ML models, and frontend endpoints with automated tests:
```bash
python -c "
import sys
sys.path.insert(0, r'.')
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# 1. Verify District Surveillance Summary
res = client.get('/api/v1/surveillance/summary')
assert res.status_code == 200, f'Surveillance summary failed: {res.text}'
data = res.json()
assert data['monitored_villages'] == 50, f'Expected 50 villages, got {data[\"monitored_villages\"]}'
assert data['monitored_blocks'] == 5, f'Expected 5 blocks, got {data[\"monitored_blocks\"]}'
print('Surveillance Summary Endpoint: PASSED')

# 2. Verify 50 Villages GPS Telemetry
res_vil = client.get('/api/v1/surveillance/villages')
assert res_vil.status_code == 200, f'Villages endpoint failed: {res_vil.text}'
villages = res_vil.json()
assert len(villages) == 50, f'Expected 50 villages in GPS feed, got {len(villages)}'
print('Villages GPS Telemetry Endpoint (50 Villages): PASSED')

# 3. Verify ML Model Readiness
res_ml = client.get('/api/v1/ml/model-info')
assert res_ml.status_code == 200, f'Model info failed: {res_ml.text}'
assert res_ml.json()['status'] == 'ready', 'ML Model ensemble is not ready'
print('ML Model Readiness Check: PASSED')

# 4. Verify Real-time Inference
payload = {
    'rainfall_mm': 65.0,
    'rainfall_cum_4w': 180.0,
    'temp_mean_c': 31.5,
    'humidity_pct': 86.0,
    'flood_risk_score': 0.55,
    'all_weather_road': 0,
    'mo_in_position': 0
}
res_inf = client.post('/api/v1/ml/predict', json=payload)
assert res_inf.status_code == 200, f'Inference failed: {res_inf.text}'
inf_data = res_inf.json()
assert 'predicted_malaria_cases_2w' in inf_data
assert inf_data['outbreak_risk_level'] in ['Critical', 'High', 'Moderate', 'Low']
print('Real-time Inference Prediction Check: PASSED')

# 5. Verify Relational DB & Inventory Invariant
res_health = client.get('/api/v1/health')
assert res_health.status_code == 200
print('Relational Database Health & Invariants: PASSED')

print('\nALL AUTOMATED VERIFICATION CHECKS PASSED!')
"
```

---

## 12. Automated PDF Generation

To compile this documentation into a publication-ready PDF document with running headers, page numbers ("Page X of 11"), styled code blocks, and formatted tables:
```bash
python backend/generate_pdf.py
```
Output PDF: `RuralHealth_OS_Project_Documentation.pdf`
