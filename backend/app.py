# app.py
from fastapi import FastAPI
from api.admin_routes import router as admin_router
from api.user_routes import router as user_router


app = FastAPI(title="Adaptive Mining Monitoring")

app.include_router(admin_router, prefix="/admin")
app.include_router(user_router, prefix="/mine")

@app.get("/health")
def health():
    return {"status": "running"}
