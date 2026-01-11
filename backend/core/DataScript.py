import ee
import geemap
import geopandas as gpd
from datetime import datetime

# --------------------------------------------------
# CONFIG
# --------------------------------------------------
GEE_PROJECT = "gen-lang-client-0864116133"   # 🔴 your enabled GEE project
SHAPEFILE_PATH = "/content/data/mines_cils.shp"
START_DATE = "2025-11-01"
END_DATE   = "2025-12-01"
EXPORT_DESC = "cil_mine_pixel_timeseries_6_new"
EXPORT_FOLDER = "GEE_ML_OUTPUT"

# --------------------------------------------------
# STEP 1: Initialize Earth Engine
# --------------------------------------------------
ee.Authenticate()
ee.Initialize(project=GEE_PROJECT)

# --------------------------------------------------
# STEP 2: Load mine polygons (NO hardcoding)
# --------------------------------------------------
gdf = gpd.read_file(SHAPEFILE_PATH)

# select ONE mine (code generalizes)
mine_row = gdf.iloc[6]
mine_id = mine_row["mine_id"] if "mine_id" in gdf.columns else "CIL_6"

mine_fc = geemap.geopandas_to_ee(
    gpd.GeoDataFrame([mine_row], crs=gdf.crs)
)

# --------------------------------------------------
# STEP 3: Cloud masking using SCL (SAFE & BASIC)
# --------------------------------------------------
def mask_s2_clouds(img):
    scl = img.select("SCL")
    mask = (
        scl.neq(3)   # cloud shadow
        .And(scl.neq(8))   # cloud
        .And(scl.neq(9))   # cirrus
        .And(scl.neq(10))  # high-prob cloud
    )
    return img.updateMask(mask)

# --------------------------------------------------
# STEP 4: Add indices WITHOUT thresholds
# --------------------------------------------------
def add_indices(img):
    ndvi = img.normalizedDifference(["B8", "B4"]).rename("NDVI")
    nbr  = img.normalizedDifference(["B8", "B11"]).rename("NBR")

    return (
        img.addBands([ndvi, nbr])
           .select(["B2", "B3" , "B4", "B8", "B11", "NDVI", "NBR"])
           .set("date", img.date().format("YYYY-MM-dd"))
           .set("mine_id", mine_id)
    )

# --------------------------------------------------
# STEP 5: Fetch Sentinel-2 (NO aggregation)
# --------------------------------------------------
s2 = (
    ee.ImageCollection("COPERNICUS/S2_SR")
      .filterBounds(mine_fc)
      .filterDate(START_DATE, END_DATE)
      .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
      .map(mask_s2_clouds)
      .map(add_indices)
)

# --------------------------------------------------
# STEP 6: Pixel-wise sampling (THIS IS KEY)
# --------------------------------------------------
def sample_pixels(img):
    samples = img.sample(
        region=mine_fc.geometry(),
        scale=10,
        geometries=True
    )

    return samples.map(
        lambda f: f.set({
            "date": img.get("date"),
            "mine_id": img.get("mine_id"),
            "latitude": f.geometry().coordinates().get(1),
            "longitude": f.geometry().coordinates().get(0)
        })
    )

pixel_fc = s2.map(sample_pixels).flatten()

# --------------------------------------------------
# STEP 7: Export for ML
# --------------------------------------------------
# task = ee.batch.Export.table.toDrive(
#     collection=pixel_fc,
#     description=EXPORT_DESC,
#     folder=EXPORT_FOLDER,
#     fileFormat="CSV"
# )

# task.start()

# print("✅ Export started. Check Google Drive →", EXPORT_FOLDER)

LOCAL_CSV_PATH = "/content/cil_mine_pixel_timeseries_21day.csv"

geemap.ee_to_csv(pixel_fc, LOCAL_CSV_PATH)

print("✅ Local CSV saved at:", LOCAL_CSV_PATH)
