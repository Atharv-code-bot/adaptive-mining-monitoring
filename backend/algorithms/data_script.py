import ee
import geopandas as gpd
import pandas as pd
import os


def fetch_mine_pixel_timeseries_df(
    gee_project: str,
    shapefile_path: str,
    mine_index: int,
    start_date: str,
    end_date: str
) -> pd.DataFrame:
    """
    Fetch pixel-wise Sentinel-2 time series from GEE
    at a FIXED INTERVAL of 21 days (NO CSV).
    """

    # --------------------------------------------------
    # 0️⃣ Safety check
    # --------------------------------------------------
    if not os.path.exists(shapefile_path):
        raise FileNotFoundError(
            f"Shapefile not found at: {shapefile_path}"
        )

    # --------------------------------------------------
    # 1️⃣ Initialize GEE
    # --------------------------------------------------
    try:
        ee.Initialize(project=gee_project)
    except Exception:
        ee.Authenticate()
        ee.Initialize(project=gee_project)

    # --------------------------------------------------
    # 2️⃣ Load mine polygon
    # --------------------------------------------------
    gdf = gpd.read_file(shapefile_path)
    mine_row = gdf.iloc[mine_index]
    mine_id = mine_row.get("mine_id", mine_index)

    mine_geom = ee.Geometry(mine_row.geometry.__geo_interface__)

    # --------------------------------------------------
    # 3️⃣ Cloud masking using SCL
    # --------------------------------------------------
    def mask_s2_clouds(img):
        scl = img.select("SCL")
        mask = (
            scl.neq(3)
            .And(scl.neq(8))
            .And(scl.neq(9))
            .And(scl.neq(10))
        )
        return img.updateMask(mask)

    # --------------------------------------------------
    # 4️⃣ Add spectral indices
    # --------------------------------------------------
    def add_indices(img):
        ndvi = img.normalizedDifference(["B8", "B4"]).rename("NDVI")
        nbr = img.normalizedDifference(["B8", "B11"]).rename("NBR")

        return (
            img.addBands([ndvi, nbr])
               .select(["B4", "B8", "B11", "NDVI", "NBR"])
               .set("date", img.date().format("YYYY-MM-dd"))
               .set("mine_id", mine_id)
        )

    # --------------------------------------------------
    # 5️⃣ Helper: filter ImageCollection at fixed interval
    # --------------------------------------------------
    def filter_by_interval(ic, start_date, end_date, step_days=21):
        start = ee.Date(start_date)
        end = ee.Date(end_date)

        offsets = ee.List.sequence(
            0,
            end.difference(start, "day"),
            step_days
        )

        def pick_best(day_offset):
            date = start.advance(day_offset, "day")
            return (
                ic.filterDate(date, date.advance(1, "day"))
                  .sort("CLOUDY_PIXEL_PERCENTAGE")
                  .first()
            )

        images = offsets.map(pick_best)

        return ee.ImageCollection(images).filter(
            ee.Filter.notNull(["system:time_start"])
        )

    # --------------------------------------------------
    # 6️⃣ Fetch Sentinel-2 (21-day interval)
    # --------------------------------------------------
    raw_s2 = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
          .filterBounds(mine_geom)
          .filterDate(start_date, end_date)
          .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
    )

    s2 = (
        filter_by_interval(raw_s2, start_date, end_date, step_days=21)
          .map(mask_s2_clouds)
          .map(add_indices)
    )

    # --------------------------------------------------
    # 7️⃣ Pixel-wise sampling
    # --------------------------------------------------
    def sample_pixels(img):
        return img.sample(
            region=mine_geom,
            scale=10,
            geometries=True
        ).map(
            lambda f: f.set({
                "date": img.get("date"),
                "mine_id": img.get("mine_id"),
                "latitude": f.geometry().coordinates().get(1),
                "longitude": f.geometry().coordinates().get(0)
            })
        )

    pixel_fc = s2.map(sample_pixels).flatten()

    # --------------------------------------------------
    # 8️⃣ FeatureCollection → Pandas DataFrame
    # --------------------------------------------------
    features = pixel_fc.getInfo()["features"]

    rows = [f["properties"] for f in features]
    df = pd.DataFrame(rows)

    return df



# # --------------------------------------------------
# # CORE FUNCTION (REUSABLE)
# # --------------------------------------------------
# def export_mine_pixel_timeseries(
#     gee_project: str,
#     shapefile_path: str,
#     mine_index: int,
#     start_date: str,
#     end_date: str,
#     local_csv_path: str
# ):
#     """
#     Extracts pixel-wise Sentinel-2 time series for a single mine polygon
#     and saves it as a local CSV.

#     Parameters
#     ----------
#     gee_project : str
#         Enabled Google Earth Engine project ID
#     shapefile_path : str
#         Path to mine shapefile
#     mine_index : int
#         Index of mine in shapefile
#     start_date : str
#         YYYY-MM-DD
#     end_date : str
#         YYYY-MM-DD
#     local_csv_path : str
#         Output CSV file path

#     Returns
#     -------
#     str
#         Path to saved CSV file
#     """

#     # --------------------------------------------------
#     # STEP 1: Initialize Earth Engine
#     # --------------------------------------------------
#     try:
#         ee.Initialize(project=gee_project)
#     except Exception:
#         ee.Authenticate()
#         ee.Initialize(project=gee_project)

#     # --------------------------------------------------
#     # STEP 2: Load mine polygons
#     # --------------------------------------------------
#     gdf = gpd.read_file(shapefile_path)

#     mine_row = gdf.iloc[mine_index]
#     mine_id = mine_row["mine_id"] if "mine_id" in gdf.columns else f"CIL_{mine_index}"

#     mine_fc = geemap.geopandas_to_ee(
#         gpd.GeoDataFrame([mine_row], crs=gdf.crs)
#     )

#     # --------------------------------------------------
#     # STEP 3: Cloud masking using SCL
#     # --------------------------------------------------
#     def mask_s2_clouds(img):
#         scl = img.select("SCL")
#         mask = (
#             scl.neq(3)
#             .And(scl.neq(8))
#             .And(scl.neq(9))
#             .And(scl.neq(10))
#         )
#         return img.updateMask(mask)

#     # --------------------------------------------------
#     # STEP 4: Add indices
#     # --------------------------------------------------
#     def add_indices(img):
#         ndvi = img.normalizedDifference(["B8", "B4"]).rename("NDVI")
#         nbr  = img.normalizedDifference(["B8", "B11"]).rename("NBR")

#         return (
#             img.addBands([ndvi, nbr])
#                .select(["B2", "B3", "B4", "B8", "B11", "NDVI", "NBR"])
#                .set("date", img.date().format("YYYY-MM-dd"))
#                .set("mine_id", mine_id)
#         )

#     # --------------------------------------------------
#     # STEP 5: Fetch Sentinel-2
#     # --------------------------------------------------
#     s2 = (
#         ee.ImageCollection("COPERNICUS/S2_SR")
#           .filterBounds(mine_fc)
#           .filterDate(start_date, end_date)
#           .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
#           .map(mask_s2_clouds)
#           .map(add_indices)
#     )

#     # --------------------------------------------------
#     # STEP 6: Pixel-wise sampling
#     # --------------------------------------------------
#     def sample_pixels(img):
#         samples = img.sample(
#             region=mine_fc.geometry(),
#             scale=10,
#             geometries=True
#         )

#         return samples.map(
#             lambda f: f.set({
#                 "date": img.get("date"),
#                 "mine_id": img.get("mine_id"),
#                 "latitude": f.geometry().coordinates().get(1),
#                 "longitude": f.geometry().coordinates().get(0)
#             })
#         )

#     pixel_fc = s2.map(sample_pixels).flatten()

#     # --------------------------------------------------
#     # STEP 7: Local CSV Export
#     # --------------------------------------------------
#     geemap.ee_to_csv(pixel_fc, local_csv_path)

#     print("✅ Local CSV saved at:", local_csv_path)

#     return local_csv_path


# #####################################

# #processed PY
# '''
# from data_extraction import export_mine_pixel_timeseries

# csv_path = export_mine_pixel_timeseries(
#     gee_project="gen-lang-client-0864116133",
#     shapefile_path="data/mines_cils.shp",
#     mine_index=6,
#     start_date="2025-11-01",
#     end_date="2025-12-01",
#     local_csv_path="data/mine_6_pixels.csv"
# )
# '''

# #########################

# # csv_path = export_mine_pixel_timeseries(
# #     gee_project=GEE_PROJECT,
# #     shapefile_path=SHAPEFILE_PATH,
# #     mine_index=mine_id,
# #     start_date=start,
# #     end_date=end,
# #     local_csv_path=f"/tmp/mine_{mine_id}.csv"
# # )

