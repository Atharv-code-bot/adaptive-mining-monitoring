import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler


# -----------------------------------------
# PHASE 1: Load & Validate Data
# -----------------------------------------

CSV_PATH = "/content/cil_mine_pixel_timeseries_339.csv"

df = pd.read_csv(CSV_PATH)

# Expected schema
required_columns = [
    "mine_id", "date", "latitude", "longitude",
    "B4", "B8", "B11", "NDVI", "NBR"
]

missing_cols = set(required_columns) - set(df.columns)
if missing_cols:
    raise ValueError(f"Missing required columns: {missing_cols}")

print("✅ Data loaded successfully")
print("Shape:", df.shape)
print("\nSchema:")
print(df.dtypes)
print("\nSample rows:")
print(df.head())


# -----------------------------------------
# PHASE 2: Date Handling
# -----------------------------------------

df["date"] = pd.to_datetime(df["date"], errors="coerce")

# Remove rows with invalid dates only
df = df.dropna(subset=["date"])

# Sort for temporal consistency
df = df.sort_values(
    by=["mine_id", "latitude", "longitude", "date"]
).reset_index(drop=True)

print("\n✅ Date conversion & sorting completed")


# -----------------------------------------
# PHASE 3: Missing / Invalid Value Handling
# -----------------------------------------

numeric_cols = ["B4", "B8", "B11", "NDVI", "NBR"]

# Replace infinite values
df[numeric_cols] = df[numeric_cols].replace([np.inf, -np.inf], np.nan)

# Drop only rows with invalid spectral values
initial_rows = df.shape[0]
df = df.dropna(subset=numeric_cols)
final_rows = df.shape[0]

print(f"\nRemoved {initial_rows - final_rows} invalid rows")
print("Remaining rows:", final_rows)


# -----------------------------------------
# PHASE 4: Feature Scaling
# -----------------------------------------

features = df[numeric_cols].values

scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Replace original columns with scaled values
df_scaled = df.copy()
df_scaled[numeric_cols] = features_scaled

print("\n✅ Feature scaling completed")


# -----------------------------------------
# PHASE 5: Temporal Helper Features
# -----------------------------------------

# Month (seasonal context)
df_scaled["month"] = df_scaled["date"].dt.month

# Time index per pixel (NOT global)
df_scaled["time_index"] = (
    df_scaled
    .groupby(["mine_id", "latitude", "longitude"])
    .cumcount()
)

print("\n✅ Temporal helper features added")


# -----------------------------------------
# PHASE 6: Final Output
# -----------------------------------------

# ML feature matrix (ONLY spectral features)
X = df_scaled[numeric_cols].values

# Metadata preserved for post-ML analysis
metadata = df_scaled[
    ["mine_id", "date", "latitude", "longitude", "month", "time_index"]
]

print("\n✅ Preprocessing completed")
print("ML Feature Matrix Shape:", X.shape)
print("\nMetadata Sample:")
print(metadata.head())