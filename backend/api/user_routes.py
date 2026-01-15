# backend/api/user_routes.py

from fastapi import APIRouter
from services.db_reader import fetch_pixels, fetch_mine_details, fetch_mine_kpi
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/pixels")
def get_pixels(mine_id: str, start: str = None, end: str = None):
    """Fetch pixel-level spectral data for a mine"""
    if not start:
        start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    if not end:
        end = datetime.now().strftime("%Y-%m-%d")
    
    df = fetch_pixels(mine_id, start, end)
    return df.to_dict(orient="records")

@router.get("/details/{mine_id}")
def get_mine_details(mine_id: int):
    """Fetch mine details including geometry and properties"""
    return fetch_mine_details(mine_id)

@router.get("/kpi/{mine_id}")
def get_mine_kpi(mine_id: int, start: str = None, end: str = None):
    """Fetch KPI metrics for a mine"""
    if not start:
        start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    if not end:
        end = datetime.now().strftime("%Y-%m-%d")
    
    return fetch_mine_kpi(mine_id, start, end)

@router.get("/spectral-signature/{mine_id}")
def get_spectral_signature(mine_id: int, start: str = None, end: str = None):
    """Fetch aggregated spectral data for radar chart"""
    if not start:
        start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    if not end:
        end = datetime.now().strftime("%Y-%m-%d")
    
    df = fetch_pixels(mine_id, start, end)
    if df.empty:
        return {"normal": {}, "anomalous": {}}
    
    # Separate normal and anomalous pixels
    normal = df[df['anomaly_label'] == -1]
    anomalous = df[df['anomaly_label'] == 1]
    
    # Compute mean values
    bands = ['b4', 'b8', 'b11', 'ndvi', 'nbr']
    
    result = {
        "normal": {band: float(normal[band].mean()) if len(normal) > 0 else 0 for band in bands},
        "anomalous": {band: float(anomalous[band].mean()) if len(anomalous) > 0 else 0 for band in bands}
    }
    
    return result
