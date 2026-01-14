# backend/services/geo.py

import geopandas as gpd
from shapely.geometry import Point
from config.settings import GEOGRAPHIC_CRS

def to_geodf(df):
    """
    Convert normalized DataFrame
    to GeoDataFrame with POINT geometry
    """

    gdf = gpd.GeoDataFrame(
        df,
        geometry=[
            Point(lon, lat)
            for lon, lat in zip(df.longitude, df.latitude)
        ],
        crs=GEOGRAPHIC_CRS
    )

    return gdf
