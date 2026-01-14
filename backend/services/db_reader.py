# backend/services/db_reader.py

import pandas as pd
from db.connection import engine

def fetch_pixels(mine_id: int, start_date: str, end_date: str):
    sql = """
        SELECT
            mine_id,
            date,
            latitude,
            longitude,
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
