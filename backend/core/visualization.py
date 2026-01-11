import io
import pandas as pd
import matplotlib.pyplot as plt
from fastapi.responses import StreamingResponse

def raw_anomaly_map(df_anomaly):
    plt.figure(figsize=(6,6))
    plt.scatter(
        df_anomaly.longitude,
        df_anomaly.latitude,
        c=df_anomaly.anomaly_label,
        cmap='coolwarm',
        s=1
    )
    plt.title("Raw Anomaly Map")

    return _stream_plot()


def final_excavation_map(df_excavated):
    plt.figure(figsize=(6,6))
    plt.scatter(
        df_excavated.longitude,
        df_excavated.latitude,
        color='red',
        s=2
    )
    plt.title("Final Excavation Map (Temporal Filtered)")

    return _stream_plot()


def no_go_zone_map(no_go_zones, excavated_gdf):
    ax = no_go_zones.plot(color='none', edgecolor='black', figsize=(6,6))
    excavated_gdf.plot(ax=ax, color='red', markersize=2)
    plt.title("No-Go Zone Violations")

    return _stream_plot()


def violation_area_timeseries(alerts_df):
    alerts_df.groupby('date')['affected_area'].sum().plot(
        kind='line', marker='o'
    )
    plt.title("Violation Area Over Time")
    plt.ylabel("Area (square meters)")

    return _stream_plot()



def excavation_vs_violation(area_ts):
    plt.figure(figsize=(10,5))

    plt.plot(
        area_ts['date'],
        area_ts['legal_excavation_area'],
        label='Legal Excavation Area',
        linewidth=2
    )

    plt.plot(
        area_ts['date'],
        area_ts['no_go_violation_area'],
        label='No-Go Violation Area',
        linewidth=2
    )

    plt.xlabel("Date")
    plt.ylabel("Area (square meters)")
    plt.title("Excavation Activity vs No-Go Zone Violations Over Time")
    plt.legend()
    plt.grid(True)

    return _stream_plot()


def monthly_illegal_area(monthly_violations):
    plt.figure(figsize=(8,4))
    plt.plot(
        monthly_violations["month"],
        monthly_violations["excavated_area_sqm"],
        marker="o"
    )
    plt.title("Monthly Illegal Excavation Area (sq.m)")
    plt.xlabel("Month")
    plt.ylabel("Excavated Area (sq.m)")
    plt.xticks(rotation=45)
    plt.grid(True)

    return _stream_plot()


def monthly_spatial_excavation(df_anomaly, month):
    df_month = df_anomaly[df_anomaly["month"] == month]

    plt.figure(figsize=(6,6))

    normal = df_month[df_month["excavated_flag"] == 0]
    plt.scatter(normal.longitude, normal.latitude, s=5, alpha=0.5, label="Normal")

    excavated = df_month[df_month["excavated_flag"] == 1]
    plt.scatter(excavated.longitude, excavated.latitude, s=8, alpha=0.8, label="Excavated")

    plt.title(f"Spatial Excavation Map — {month}")
    plt.xlabel("Longitude")
    plt.ylabel("Latitude")
    plt.legend()
    plt.grid(True)

    return _stream_plot()


def _stream_plot():
    buf = io.BytesIO()
    plt.savefig(buf, format="png", dpi=150, bbox_inches="tight")
    plt.close()
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")




# from fastapi import FastAPI
# from plots.excavation_plots import raw_anomaly_map

# app = FastAPI()

# @app.get("/plots/raw-anomaly")
# def raw_anomaly():
#     return raw_anomaly_map(df_anomaly)



