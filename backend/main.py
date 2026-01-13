# # backend/main.py

# from fastapi import FastAPI
# from services.runner import run_mine_pipeline
# from services.serializer import build_monthly_masks, mask_to_base64

# app = FastAPI(title="Adaptive Mining Monitoring")

# @app.get("/mine/{mine_id}/months")
# def available_months(mine_id: str):
#     df = run_mine_pipeline(mine_id)
#     months = sorted(df["date"].dt.to_period("M").astype(str).unique())
#     return {"mine_id": mine_id, "months": months}


# @app.get("/mine/{mine_id}/month/{month}")
# def month_visual(mine_id: str, month: str):
#     df = run_mine_pipeline(mine_id)

#     masks = build_monthly_masks(df)
#     exc, nogo = masks[month]

#     return {
#         "mine_id": mine_id,
#         "month": month,
#         "excavation_png": mask_to_base64(exc),
#         "nogo_png": mask_to_base64(nogo)
#     }

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd

# -----------------------------------------
# Internal Pipeline Imports
# -----------------------------------------
from core.DataProcessed import preprocess_pixel_timeseries
from core.Model import run_anomaly_detection

from core.visualization import (
    raw_anomaly_map,
    final_excavation_map,
    no_go_zone_map,
    violation_area_timeseries,
    excavation_vs_violation,
    monthly_illegal_area,
    monthly_spatial_excavation
)

# -----------------------------------------
# CONFIG
# -----------------------------------------
DATA_DIR = "data"   # folder where CSVs live

# -----------------------------------------
# FastAPI App
# -----------------------------------------
app = FastAPI(
    title="Mine Excavation Monitoring System",
    description="Pixel-wise anomaly detection & violation monitoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------------------
# GLOBAL PIPELINE CACHE
# -----------------------------------------
GLOBALS = {}

# -----------------------------------------
# HEALTH CHECK
# -----------------------------------------
@app.get("/health")
def health():
    return {"status": "running"}

# -----------------------------------------
# PIPELINE EXECUTION ENDPOINT
# -----------------------------------------
@app.post("/run-pipeline")
def run_pipeline(
    mine_id: str = Query(..., description="Mine ID (e.g. 339)")
):
    """
    Executes pipeline using local CSV:
    data/cil_mine_pixel_timeseries_<mine_id>.csv
    """

    try:
        # 1️⃣ Resolve CSV path from mine_id
        csv_filename = f"cil_mine_pixel_timeseries_{mine_id}.csv"
        csv_path = os.path.join(DATA_DIR, csv_filename)

        if not os.path.exists(csv_path):
            raise HTTPException(
                status_code=404,
                detail=f"CSV not found for mine_id={mine_id}"
            )

        # 2️⃣ Preprocessing (CSV → DF)
        X, metadata, df_scaled = preprocess_pixel_timeseries(csv_path)

        # 3️⃣ Anomaly Detection + Violation Logic
        df_anomaly, violations, alerts_df = run_anomaly_detection(df_scaled)

        # 4️⃣ Cache outputs
        GLOBALS["df_anomaly"] = df_anomaly
        GLOBALS["violations"] = violations
        GLOBALS["alerts_df"] = alerts_df
        GLOBALS["df_excavated"] = df_anomaly[df_anomaly["excavated_flag"] == 1]
        GLOBALS["excavated_gdf"] = violations
        GLOBALS["no_go_zones"] = violations[["zone_type", "geometry"]].drop_duplicates()

        return {
            "status": "success",
            "mine_id": mine_id,
            "rows_processed": len(df_scaled),
            "csv_used": csv_filename,
            "available_plots": [
                "raw-anomaly",
                "final-excavation",
                "no-go-zone",
                "violation-timeseries",
                "excavation-vs-violation",
                "monthly-illegal",
                "monthly-spatial"
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------
# VISUALIZATION ENDPOINTS
# -----------------------------------------
@app.get("/plots/raw-anomaly")
def plot_raw_anomaly():
    return raw_anomaly_map(GLOBALS["df_anomaly"])

@app.get("/plots/final-excavation")
def plot_final_excavation():
    return final_excavation_map(GLOBALS["df_excavated"])

@app.get("/plots/no-go-zone")
def plot_no_go_zone():
    return no_go_zone_map(
        GLOBALS["no_go_zones"],
        GLOBALS["excavated_gdf"]
    )

@app.get("/plots/violation-timeseries")
def plot_violation_timeseries():
    return violation_area_timeseries(GLOBALS["alerts_df"])

@app.get("/plots/excavation-vs-violation")
def plot_excavation_vs_violation():
    return excavation_vs_violation(GLOBALS["alerts_df"])

@app.get("/plots/monthly-illegal")
def plot_monthly_illegal():
    return monthly_illegal_area(GLOBALS["df_anomaly"])

@app.get("/plots/monthly-spatial")
def plot_monthly_spatial(month: str = Query(...)):
    return monthly_spatial_excavation(GLOBALS["df_anomaly"], month)


# @app.get("/df_anomaly")
# def get_df_anomaly():
    
    
@app.post("/df_anomaly/{mine_id}")
def save_results(mine_id: str):
    df = GLOBALS.get("df_anomaly")
    if df is None:
        raise HTTPException(400, "No data to save")

    path = f"data/raw/df_anomaly_{mine_id}.csv"
    df.to_csv(path, index=False)

    return {"status": "saved", "path": path}
