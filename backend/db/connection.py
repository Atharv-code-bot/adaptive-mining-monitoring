# backend/db/connection.py

from sqlalchemy import create_engine
from config.settings import DATABASE_URL

# Create SQLAlchemy engine
# Set pool_pre_ping to avoid stale connection errors
try:
    engine = create_engine(
        DATABASE_URL,
        echo=False,          # set True only for debugging
        future=True,
        pool_pre_ping=True,  # Test connections before using them
    )
except Exception as e:
    print(f"Warning: Could not create database engine: {e}")
    print("Backend will use CSV fallback for data")
    engine = None

