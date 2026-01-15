🛰️ Adaptive Mining Activity Monitoring – Backend

This repository contains the backend system for the Adaptive Mining Activity Monitoring project.

The backend performs satellite-based mining activity analysis using Google Earth Engine (Sentinel-2), applies machine-learning anomaly detection, and stores pixel-level geospatial time-series data in PostgreSQL + PostGIS.
Processed data is then served through FastAPI APIs for fast visualization and analysis.

🧠 Core Idea (Very Important)

Heavy computation runs ONLY on admin request

Processed data is stored once in database

User APIs NEVER trigger Earth Engine or ML

Database becomes the single source of truth

This avoids recomputation, improves performance, and ensures reproducibility.

🏗️ System Architecture (Backend)
Admin API
   ↓
Google Earth Engine (Sentinel-2)
   ↓
Pixel-wise feature extraction (21-day windows)
   ↓
ML anomaly detection
   ↓
PostgreSQL + PostGIS (persistent storage)
   ↓
User API (read-only, fast)

🧰 Tech Stack

Framework: FastAPI

Satellite Data: Google Earth Engine (Sentinel-2 SR Harmonized)

Machine Learning: Scikit-learn (Isolation Forest)

Database: PostgreSQL + PostGIS

Geospatial: GeoPandas, Shapely

Language: Python 3.10+

🌐 Default Ports & Access
Service	Value
FastAPI server	http://127.0.0.1:8000
Swagger UI	http://127.0.0.1:8000/docs
PostgreSQL	localhost:5432
📁 Backend Folder Structure
backend/
│
├── api/
│   ├── admin_routes.py        # Admin-only pipeline trigger
│   └── user_routes.py         # Read-only user APIs
│
├── algorithms/
│   ├── data_script.py         # GEE data extraction (21-day interval)
│   ├── preprocess.py          # Feature preprocessing
│   └── model.py               # ML anomaly detection
│
├── processing/
│   └── admin_processor.py     # Admin pipeline orchestration
│
├── services/
│   ├── db_reader.py           # Database read queries
│   ├── db_write.py            # Database insert logic
│   ├── geo.py                 # Geometry helpers
│   └── normalize.py           # Schema normalization
│
├── db/
│   └── schema.sql             # PostgreSQL + PostGIS schema
│
├── config/
│   └── settings.py            # GEE project & shapefile path
│
└── app.py                     # FastAPI entry point

⚙️ LOCAL SETUP (FOR JUDGES)

Follow the steps exactly in order.
Docker is NOT required.

1️⃣ Python Environment Setup
Create virtual environment
python -m venv venv

Activate virtual environment

Windows

venv\Scripts\activate


Linux / macOS

source venv/bin/activate

Install dependencies
pip install -r requirements.txt

2️⃣ PostgreSQL + PostGIS Setup
Install PostgreSQL

Download from:
👉 https://www.postgresql.org/download/

During installation:

Keep default port: 5432

Set postgres password (any value)

Database Credentials (IMPORTANT)

For simplicity and reproducibility, this project uses:

Item	Value
Database	aurora_db
User	aurora
Password	aurora
Host	localhost
Port	5432

Judges are expected to use password = aurora

Create database & user
psql -U postgres

CREATE DATABASE aurora_db;
CREATE USER aurora WITH PASSWORD 'aurora';
GRANT ALL PRIVILEGES ON DATABASE aurora_db TO aurora;
\q

Enable PostGIS
psql -U aurora -d aurora_db

CREATE EXTENSION postgis;
SELECT PostGIS_Version();
\q

Create schema

From project root:

psql -U aurora -d aurora_db -f backend/db/schema.sql


Verify:

psql -U aurora -d aurora_db
\d pixel_timeseries;
\q

3️⃣ Google Earth Engine (GEE) Setup
Step 1: Enable Earth Engine

Visit: https://earthengine.google.com/

Sign in with Google account

Request access (usually instant)

Step 2: Create Google Cloud Project

Visit: https://console.cloud.google.com/

Create a new project

Copy the Project ID

Step 3: Authenticate Earth Engine (One-time)
earthengine authenticate


A browser window will open → approve access.

Step 4: Configure backend

Edit backend/config/settings.py:

GEE_PROJECT = "your-gee-project-id"
SHAPEFILE_PATH = "backend/data/mines_cil_polygon/mines_cils.shp"

4️⃣ Start Backend Server
uvicorn backend.app:app --reload


Server runs at:

http://127.0.0.1:8000


Health check:

curl http://127.0.0.1:8000/health


Expected:

{"status":"running"}

🚀 API USAGE
🔐 Admin API (Heavy Processing)
Purpose

Fetch Sentinel-2 data

Run ML anomaly detection

Store pixel-wise results in database

Avoid duplicate recomputation

Endpoint
POST /admin/run

Parameters
Name	Type
mine_id	integer
start_date	YYYY-MM-DD
end_date	YYYY-MM-DD
Example
curl -X POST \
"http://127.0.0.1:8000/admin/run?mine_id=0&start_date=2025-01-01&end_date=2025-06-01"

Behavior (Important)
Case	Result
All data already exists	Skipped
Partial overlap	Only missing range processed
New request	Full processing
👤 User API (Read-Only)
Purpose

Fetch stored mining data

No Earth Engine

No ML execution

Endpoint
GET /mine/pixels

Parameters
Name	Type
mine_id	integer
start	YYYY-MM-DD
end	YYYY-MM-DD
Example
curl \
"http://127.0.0.1:8000/mine/pixels?mine_id=0&start=2025-01-01&end=2025-05-15"
