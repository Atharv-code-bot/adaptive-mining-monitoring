# backend/api/admin_routes.py

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from processing.admin_processor import run_admin_pipeline


router = APIRouter()

@router.post("/run")
def run_pipeline(
    mine_id: int,
    start_date: str,
    end_date: str
):
    try:
        result = run_admin_pipeline(
            mine_id=mine_id,
            start_date=start_date,
            end_date=end_date
        )
        return JSONResponse(
            status_code=200,
            content=result
        )
    except ValueError as e:
        print(f"Validation Error: {str(e)}")
        return JSONResponse(
            status_code=400,
            content={"error": f"Invalid input: {str(e)}"}
        )
    except Exception as e:
        print(f"Pipeline Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"Pipeline failed: {str(e)}"}
        )
