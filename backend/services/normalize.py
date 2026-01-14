# backend/services/normalize.py

import pandas as pd

def normalize_df(df: pd.DataFrame, mine_id: str) -> pd.DataFrame:
    """
    Normalize algorithm output dataframe
    so it matches database schema exactly.
    """

    df = df.copy()

    # Ensure mine_id exists
    df["mine_id"] = int(mine_id)

    # Ensure date is DATE (not datetime)
    df["date"] = pd.to_datetime(df["date"]).dt.date

    # Rename columns to DB-friendly lowercase
    df = df.rename(columns={
        "B4": "b4",
        "B8": "b8",
        "B11": "b11",
        "NDVI": "ndvi",
        "NBR": "nbr"
    })

    # Select only what we store
    df = df[
        [
            "mine_id",
            "date",
            "latitude",
            "longitude",
            "b4",
            "b8",
            "b11",
            "ndvi",
            "nbr",
            "anomaly_label",
            "anomaly_score",
            "excavated_flag"
        ]
    ]

    return df
