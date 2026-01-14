# backend/api/user_routes.py

from fastapi import APIRouter
from services.db_reader import fetch_pixels

router = APIRouter()

@router.get("/pixels")
def get_pixels(mine_id: str, start: str, end: str):
    df = fetch_pixels(mine_id, start, end)
    return df.to_dict(orient="records")
