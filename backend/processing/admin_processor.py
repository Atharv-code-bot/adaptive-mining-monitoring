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
    # 1️⃣ Fetch data from GEE
    df_raw = fetch_mine_pixel_timeseries_df(
        gee_project=GEE_PROJECT,
        shapefile_path=SHAPEFILE_PATH,
        mine_index=mine_id,
        start_date=start_date,
        end_date=end_date
    )

    # 2️⃣ Preprocess
    _, _, df_scaled = preprocess_pixel_timeseries(df_raw)

    # 3️⃣ Algorithm
    df_anomaly, _, _ = run_anomaly_detection(df_scaled)

    # 4️⃣ Normalize
    df_clean = normalize_df(df_anomaly, mine_id)

    # 5️⃣ Geometry
    gdf = to_geodf(df_clean)

    # 6️⃣ Store
    insert_pixels(gdf)

    return {
        "status": "success",
        "mine_id": mine_id,
        "rows_inserted": len(gdf)
    }
