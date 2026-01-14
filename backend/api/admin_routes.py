# backend/api/admin_routes.py

from fastapi import APIRouter
from processing.admin_processor import run_admin_pipeline


router = APIRouter()

@router.post("/run")
def run_pipeline(
    mine_id: int,
    start_date: str,
    end_date: str
):
    return run_admin_pipeline(
        mine_id=mine_id,
        start_date=start_date,
        end_date=end_date
    )
