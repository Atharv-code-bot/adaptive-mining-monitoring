# backend/processing/admin_processor.py

from algorithms.data_script import fetch_mine_pixel_timeseries_df
from algorithms.preprocess import preprocess_pixel_timeseries
from algorithms.model import run_anomaly_detection
from services.normalize import normalize_df
from services.geo import to_geodf
from services.db_write import insert_pixels
from config.settings import GEE_PROJECT, SHAPEFILE_PATH


def run_admin_pipeline(
    mine_id: int,
    start_date: str,
    end_date: str
):
    try:
        # 1️⃣ Fetch data from GEE
        print(f"[Admin Pipeline] Fetching data for mine_id={mine_id}, date_range={start_date} to {end_date}")
        df_raw = fetch_mine_pixel_timeseries_df(
            gee_project=GEE_PROJECT,
            shapefile_path=SHAPEFILE_PATH,
            mine_index=mine_id,
            start_date=start_date,
            end_date=end_date
        )
        print(f"[Admin Pipeline] Fetched {len(df_raw)} rows from GEE")

        # 2️⃣ Preprocess
        print("[Admin Pipeline] Preprocessing data...")
        _, _, df_scaled = preprocess_pixel_timeseries(df_raw)

        # 3️⃣ Algorithm
        print("[Admin Pipeline] Running anomaly detection...")
        df_anomaly, _, _ = run_anomaly_detection(df_scaled)

        # 4️⃣ Normalize
        print("[Admin Pipeline] Normalizing data...")
        df_clean = normalize_df(df_anomaly, mine_id)

        # 5️⃣ Geometry
        print("[Admin Pipeline] Converting to GeoDataFrame...")
        gdf = to_geodf(df_clean)

        # 6️⃣ Store
        print(f"[Admin Pipeline] Inserting {len(gdf)} rows into database...")
        insert_pixels(gdf)

        return {
            "status": "success",
            "mine_id": mine_id,
            "rows_inserted": len(gdf)
        }
    except Exception as e:
        error_msg = str(e)
        print(f"[Admin Pipeline] Error: {error_msg}")
        raise ValueError(f"Pipeline processing failed: {error_msg}")
