# backend/services/db_reader.py

import pandas as pd
from db.connection import engine
from services.csv_reader import fetch_pixels_from_csv

def fetch_pixels(mine_id: int, start_date: str, end_date: str):
    """
    Fetch pixel data from database if available, otherwise from CSV
    """
    try:
        sql = """
            SELECT
                mine_id,
                date,
                latitude,
                longitude,
                b4,
                b8,
                b11,
                ndvi,
                nbr,
                anomaly_label,
                anomaly_score,
                excavated_flag
            FROM pixel_timeseries
            WHERE mine_id = %s
              AND date BETWEEN %s AND %s
            ORDER BY date;
        """

        return pd.read_sql(
            sql,
            engine,
            params=(mine_id, start_date, end_date)
        )
    except Exception as e:
        print(f"Database connection failed: {e}. Falling back to CSV data.")
        # Fallback to CSV if database is unavailable
        return fetch_pixels_from_csv(mine_id, start_date, end_date)

def fetch_mine_details(mine_id: int):
    """Fetch mine details from mines table"""
    try:
        sql = """
            SELECT
                mine_id,
                display_name,
                state,
                district,
                subdistrict,
                ST_AsGeoJSON(geometry) as geometry
            FROM mines
            WHERE mine_id = %s;
        """
        
        result = pd.read_sql(sql, engine, params=(mine_id,))
        if result.empty:
            return None
        
        row = result.iloc[0]
        import json
        
        return {
            "type": "Feature",
            "properties": {
                "mine_id": int(row['mine_id']),
                "display_name": row['display_name'],
                "state": row['state'],
                "district": row['district'],
                "subdistrict": row['subdistrict']
            },
            "geometry": json.loads(row['geometry'])
        }
    except Exception as e:
        print(f"Error fetching mine details: {e}")
        return None

def fetch_mine_kpi(mine_id: int, start_date: str, end_date: str):
    """Fetch KPI metrics for a mine"""
    try:
        sql = """
            SELECT
                COUNT(*) as total_pixels,
                SUM(CASE WHEN anomaly_label = 1 THEN 1 ELSE 0 END) as excavated_pixels,
                AVG(CASE WHEN anomaly_label = -1 THEN ndvi ELSE NULL END) as avg_ndvi_normal,
                AVG(CASE WHEN anomaly_label = 1 THEN ndvi ELSE NULL END) as avg_ndvi_excavated,
                MAX(anomaly_score) as max_anomaly_score,
                MIN(date) as start_date,
                MAX(date) as end_date
            FROM pixel_timeseries
            WHERE mine_id = %s
              AND date BETWEEN %s AND %s;
        """
        
        result = pd.read_sql(sql, engine, params=(mine_id, start_date, end_date))
        if result.empty:
            return {
                "total_pixels": 0,
                "excavated_pixels": 0,
                "excavated_percentage": 0,
                "avg_ndvi_normal": 0,
                "avg_ndvi_excavated": 0,
                "max_anomaly_score": 0,
                "date_range": {"start": start_date, "end": end_date}
            }
        
        row = result.iloc[0]
        total = row['total_pixels'] or 0
        excavated = row['excavated_pixels'] or 0
        
        return {
            "total_pixels": int(total),
            "excavated_pixels": int(excavated),
            "excavated_percentage": round((excavated / total * 100) if total > 0 else 0, 2),
            "avg_ndvi_normal": float(row['avg_ndvi_normal']) if row['avg_ndvi_normal'] else 0,
            "avg_ndvi_excavated": float(row['avg_ndvi_excavated']) if row['avg_ndvi_excavated'] else 0,
            "max_anomaly_score": float(row['max_anomaly_score']) if row['max_anomaly_score'] else 0,
            "date_range": {
                "start": str(row['start_date']),
                "end": str(row['end_date'])
            }
        }
    except Exception as e:
        print(f"Error fetching KPI: {e}")
        return {
            "total_pixels": 0,
            "excavated_pixels": 0,
            "excavated_percentage": 0,
            "avg_ndvi_normal": 0,
            "avg_ndvi_excavated": 0,
            "max_anomaly_score": 0,
            "date_range": {"start": start_date, "end": end_date}
        }
