import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

# Load data
df = pd.read_csv("/content/cil_mine_pixel_timeseries_339.csv")
df['date'] = pd.to_datetime(df['date'])

FEATURES = ['B4', 'B8', 'B11', 'NDVI', 'NBR']

results = []

for mine_id, mine_df in df.groupby('mine_id'):
    X = mine_df[FEATURES].values

    model = IsolationForest(
        n_estimators=200,
        max_samples='auto',
        contamination='auto',
        random_state=42
    )

    model.fit(X)

    mine_df['anomaly_label'] = model.predict(X)      # -1 anomaly, 1 normal
    mine_df['anomaly_score'] = model.decision_function(X)

    results.append(mine_df)

df_anomaly = pd.concat(results).reset_index(drop=True)
#######################

df_anomaly = df_anomaly.sort_values(
    by=['mine_id', 'latitude', 'longitude', 'date']
)

df_anomaly['excavated_flag'] = 0

for (mine, lat, lon), pixel_df in df_anomaly.groupby(
    ['mine_id', 'latitude', 'longitude']
):
    pixel_df = pixel_df.sort_values('date')

    anomaly_runs = (
        pixel_df['anomaly_label']
        .eq(-1)
        .astype(int)
        .rolling(window=2)
        .sum()
    )

    df_anomaly.loc[pixel_df.index, 'excavated_flag'] = (
        anomaly_runs >= 2
    ).astype(int)
############################################

import geopandas as gpd
from shapely.geometry import Point
from shapely.ops import unary_union

veg_pixels = df.groupby(
    ['latitude', 'longitude']
)['NDVI'].mean().reset_index()

veg_pixels = veg_pixels[veg_pixels['NDVI'] > veg_pixels['NDVI'].quantile(0.9)]

veg_gdf = gpd.GeoDataFrame(
    veg_pixels,
    geometry=gpd.points_from_xy(
        veg_pixels.longitude,
        veg_pixels.latitude
    ),
    crs="EPSG:4326"
)

veg_polygon = veg_gdf.buffer(0.0005).unary_union

veg_zone = gpd.GeoDataFrame(
    {'zone_type': ['Synthetic Forest Protection Zone']},
    geometry=[veg_polygon],
    crs="EPSG:4326"
)

############################################

water_pixels = df.groupby(
    ['latitude', 'longitude']
)[['B8', 'B11']].mean().reset_index()

water_pixels = water_pixels[
    (water_pixels['B8'] < water_pixels['B8'].quantile(0.1)) &
    (water_pixels['B11'] < water_pixels['B11'].quantile(0.1))
]

water_gdf = gpd.GeoDataFrame(
    water_pixels,
    geometry=gpd.points_from_xy(
        water_pixels.longitude,
        water_pixels.latitude
    ),
    crs="EPSG:4326"
)

water_polygon = water_gdf.buffer(0.0005).unary_union

water_zone = gpd.GeoDataFrame(
    {'zone_type': ['Synthetic Water Protection Zone']},
    geometry=[water_polygon],
    crs="EPSG:4326"
)

##########################################

no_go_zones = pd.concat([veg_zone, water_zone])

######################################

df_excavated = df_anomaly[df_anomaly['excavated_flag'] == 1]

excavated_gdf = gpd.GeoDataFrame(
    df_excavated,
    geometry=gpd.points_from_xy(
        df_excavated.longitude,
        df_excavated.latitude
    ),
    crs="EPSG:4326"
)

violations = gpd.overlay(
    excavated_gdf,
    no_go_zones,
    how='intersection'
)

violations['pixel_area'] = 10 * 10  # Sentinel-2 resolution (10m x 10m = 100 sq meters)

##################################3

alerts = []

for (mine, zone), vdf in violations.groupby(['mine_id', 'zone_type']):
    area_by_date = vdf.groupby('date')['pixel_area'].sum()

    prev = 0
    streak = 0

    for date, area in area_by_date.items():
        if area > 0 and prev == 0:
            alert_type = "First Violation"
            streak = 1
        elif area > prev:
            alert_type = "Expansion Violation"
            streak += 1
        elif area > 0:
            alert_type = "Persistent Violation"
            streak += 1
        else:
            continue

        alerts.append({
            'mine_id': mine,
            'date': date,
            'zone_type': zone,
            'alert_type': alert_type,
            'affected_area': area
        })

        prev = area

alerts_df = pd.DataFrame(alerts)


#######################################################