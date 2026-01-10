# backend/services/runner.py

from core.pipeline import full_pipeline

def run_mine_pipeline(mine_id: str):
    csv_path = f"backend/data/mines/{mine_id}.csv"
    df_final = full_pipeline(csv_path)
    return df_final
