# RuralHealth OS: Outbreak Surveillance & Healthcare Resource Management System

An intelligent climate-triangulated epidemiological surveillance and healthcare resource allocation system designed to revolutionize rural healthcare delivery through data-driven foresight and proactive intervention.

> 📖 **[Click here for the Full Project Documentation & Execution Guide](PROJECT_DOCUMENTATION.md)**

## Product Vision

To revolutionize healthcare delivery by creating an intelligent ecosystem where data-driven foresight prevents crises, optimizes resources, and preserves lives through proactive intervention rather than reactive response.

## Target Audience

- **Healthcare Administrators**: Managing resource allocation and operational efficiency
- **Frontline Medical Staff**: Providing patient care and accessing patient information
- **Supply Chain Managers**: Coordinating logistics and resource distribution
- **Government Health Officials**: Developing policy interventions and monitoring healthcare systems

## Core Features

- **AI Clinical Foresight & Triage Prediction**: Real-time Machine Learning model trained on clinical vitals (SpO2, heart rate, blood pressure, respiratory rate) to predict triage severity levels and clinical risk scores (0-100).
- **Intelligent Resource Forecasting**: Automatically predicts necessary hospital assets (Ventilators, ICU Beds, Oxygen Concentrators) based on patient degradation risk.
- **Patient Management**: Complete CRUD operations for patient records with medical history.
- **Resource Management**: Track and manage healthcare resources (beds, equipment, supplies) with real-time depletion thresholds.
- **Admission Management**: Handle patient admissions and discharges with integrated AI Triage Assist.
- **Resource Allocation**: Allocate resources to patient admissions with live inventory decrement and automatic restoration.

## Technology Stack

- **Backend Framework**: FastAPI (Python)
- **Machine Learning**: Scikit-Learn (Random Forest Ensemble, StandardScaler, OneHotEncoder, Joblib)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Data Validation**: Pydantic v2
- **Architecture**: Modular Monolith with ML Pipeline Integration

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

## Running Locally

1. Activate the virtual environment (if not already activated):
```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Start the development server:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

3. Access the application:
- API: http://localhost:8000
- Interactive API Documentation: http://localhost:8000/docs
- Alternative API Documentation: http://localhost:8000/redoc

## API Endpoints

### Patients
- `POST /api/v1/patients` - Create a new patient
- `GET /api/v1/patients` - List all patients
- `GET /api/v1/patients/{patient_id}` - Get patient by ID
- `PUT /api/v1/patients/{patient_id}` - Update patient
- `DELETE /api/v1/patients/{patient_id}` - Delete patient

### Resources
- `POST /api/v1/resources` - Create a new resource
- `GET /api/v1/resources` - List all resources
- `GET /api/v1/resources/{resource_id}` - Get resource by ID
- `PUT /api/v1/resources/{resource_id}` - Update resource
- `DELETE /api/v1/resources/{resource_id}` - Delete resource

### Admissions
- `POST /api/v1/admissions` - Create a new admission
- `GET /api/v1/admissions` - List all admissions
- `GET /api/v1/admissions/{admission_id}` - Get admission by ID
- `PUT /api/v1/admissions/{admission_id}` - Update admission
- `DELETE /api/v1/admissions/{admission_id}` - Delete admission

### Resource Allocations
- `POST /api/v1/resource-allocations` - Create a new resource allocation
- `GET /api/v1/resource-allocations` - List all resource allocations
- `GET /api/v1/resource-allocations/{allocation_id}` - Get allocation by ID
- `DELETE /api/v1/resource-allocations/{allocation_id}` - Delete allocation

### Machine Learning & Clinical Foresight
- `POST /api/v1/ml/predict` - Predict triage severity & recommended equipment from vitals
- `GET /api/v1/ml/model-info` - Get model training status, accuracy, and feature importances
- `POST /api/v1/ml/train` - Retrain the Random Forest model on the active dataset
- `POST /api/v1/ml/upload-dataset` - Upload custom CSV dataset and automatically retrain model
- See `DATASET_GUIDE.md` for complete dataset formatting specifications.

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── requirements.txt     # Python dependencies
│   └── routers/
│       └── health_router.py # API route handlers
├── .env.example             # Environment variables template
└── README.md                # This file
```

## Database Schema

### Patients
- Patient demographic and contact information
- Medical record numbers
- Relationship to admissions

### Resources
- Resource type and availability tracking
- Location and status management
- Quantity tracking (available vs. total)

### Admissions
- Patient admission records
- Department and diagnosis information
- Severity levels and status tracking

### Resource Allocations
- Links resources to patient admissions
- Tracks allocation and return dates
- Manages resource availability

## Environment Variables

See `.env.example` for all available configuration options:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret key for security operations
- `CORS_ORIGINS`: Allowed CORS origins
- `DEBUG`: Enable/disable debug mode
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARNING, ERROR)

## Development

### Database Initialization

The database is automatically initialized on application startup. Tables are created based on the SQLAlchemy models defined in `backend/models.py`.

### Adding New Features

1. Define database models in `backend/models.py`
2. Create Pydantic schemas in `backend/schemas.py`
3. Implement API routes in `backend/routers/`
4. Register routers in `backend/main.py`

## Security

- Environment variables for sensitive configuration
- Input validation using Pydantic schemas
- SQL injection prevention through SQLAlchemy ORM
- CORS configuration for API access control

## License

[Your License Here]

## Support

For issues and questions, please contact the development team.
