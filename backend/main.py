# backend/main.py

from fastapi import FastAPI
from services.runner import run_mine_pipeline
from services.serializer import build_monthly_masks, mask_to_base64

app = FastAPI(title="Adaptive Mining Monitoring")

@app.get("/mine/{mine_id}/months")
def available_months(mine_id: str):
    df = run_mine_pipeline(mine_id)
    months = sorted(df["date"].dt.to_period("M").astype(str).unique())
    return {"mine_id": mine_id, "months": months}


@app.get("/mine/{mine_id}/month/{month}")
def month_visual(mine_id: str, month: str):
    df = run_mine_pipeline(mine_id)

    masks = build_monthly_masks(df)
    exc, nogo = masks[month]

    return {
        "mine_id": mine_id,
        "month": month,
        "excavation_png": mask_to_base64(exc),
        "nogo_png": mask_to_base64(nogo)
    }
