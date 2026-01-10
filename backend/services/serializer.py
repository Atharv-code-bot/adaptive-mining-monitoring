# backend/services/serializer.py

import numpy as np
from PIL import Image
import io
import base64

def build_monthly_masks(df):
    df["month"] = df["date"].dt.to_period("M").astype(str)

    H = df["y"].max() + 1
    W = df["x"].max() + 1

    masks = {}

    for m in sorted(df["month"].unique()):
        sub = df[df["month"] == m]

        exc = np.zeros((H, W), dtype=np.uint8)
        nogo = np.zeros((H, W), dtype=np.uint8)

        for _, r in sub.iterrows():
            if r["anomaly_final"] == 1:
                exc[r.y, r.x] = 1
                if r["is_nogo"] == 1:
                    nogo[r.y, r.x] = 1

        masks[m] = (exc, nogo)

    return masks


def mask_to_base64(mask):
    h, w = mask.shape
    img = np.zeros((h, w, 4), dtype=np.uint8)
    img[mask == 1] = [255, 0, 0, 140]

    image = Image.fromarray(img, "RGBA")
    buf = io.BytesIO()
    image.save(buf, format="PNG")

    return base64.b64encode(buf.getvalue()).decode()
