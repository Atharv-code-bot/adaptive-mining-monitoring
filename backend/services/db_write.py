# backend/services/db_write.py

from db.connection import engine
from geoalchemy2 import Geometry

def insert_pixels(gdf):
    """
    Insert pixel GeoDataFrame into PostGIS.
    Compatible with older GeoPandas versions.
    """

    # Ensure CRS is set
    gdf = gdf.set_crs(epsg=4326, allow_override=True)

    # 🔴 FORCE geometry column name to what GeoPandas expects
    if gdf.geometry.name != "geometry":
        gdf = gdf.rename_geometry("geometry")

    gdf.to_postgis(
        name="pixel_timeseries",
        con=engine,
        if_exists="append",
        index=False,
        dtype={
            "geometry": Geometry("POINT", srid=4326)
        }
    )
