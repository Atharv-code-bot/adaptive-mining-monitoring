# backend/db/connection.py

from sqlalchemy import create_engine
from config.settings import DATABASE_URL

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=False,          # set True only for debugging
    future=True
)
