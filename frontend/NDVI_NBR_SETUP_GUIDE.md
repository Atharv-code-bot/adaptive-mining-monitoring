# NDVI vs NBR Scatter Plot - Setup & Usage Guide

## ✅ Implementation Complete

Your NDVI vs NBR scatter plot visualization has been successfully implemented and integrated into the frontend!

## 🚀 Quick Start

### 1. **Start the Development Server** (if not already running)
```bash
cd frontend
npm run dev
```
The server will start at `http://localhost:5174/`

### 2. **Test the Feature**
1. Open the application in your browser
2. Look for mine markers on the map
3. **Click on any mine marker** to open the details panel
4. Click the **"📊 NDVI vs NBR"** tab
5. Watch the scatter plot load with spectral data!

## 📊 What You'll See

### Scatter Plot Features:
- **X-Axis**: NDVI values (vegetation index)
- **Y-Axis**: NBR values (burn ratio)
- **Red Points**: Disturbed land (anomaly = 1)
- **Green Points**: Undisturbed land (anomaly = -1)
- **Point Size**: Represents anomaly_score (larger = higher confidence)

### Interactive Features:
- **Hover over points** to see exact values
- **Zoom** with mouse scroll
- **Pan** by clicking and dragging
- **Toggle** data series via legend
- **Download** plot as PNG

## 📁 Files Created/Modified

### New Files:
- `frontend/src/components/NDVIvsNBRScatter.jsx` - Main scatter plot component

### Modified Files:
- `frontend/src/components/MineDetailsPanel.jsx` - Added tab interface with scatter plot integration

### Dependencies Added:
- `react-plotly.js` - Interactive plotting library
- `plotly.js` - Plotting engine
- `papaparse` - CSV parsing

## 🔍 How It Works

1. **Data Loading**: When you click on a mine and switch to the NDVI vs NBR tab, the component loads the pixel timeseries CSV data
2. **Data Filtering**: The CSV is filtered to show only data points for the selected mine (by mine_id)
3. **Data Processing**: Points are separated by anomaly classification (disturbed vs undisturbed)
4. **Visualization**: Plotly creates an interactive scatter plot with color coding and point sizing

## 💡 Data Structure

The `pixel_timeseries (1).csv` contains:
```
mine_id, ndvi, nbr, anomaly_label, anomaly_score, ...
```

- **mine_id**: Identifies which mine the pixel belongs to
- **ndvi**: Normalized Difference Vegetation Index (-1 to 1)
- **nbr**: Normalized Burn Ratio (-1 to 1)
- **anomaly_label**: 1 (disturbed) or -1 (undisturbed)
- **anomaly_score**: Confidence score (0 to 1)

## 🎨 Visual Encoding Reference

| Visual Element | Represents |
|---|---|
| Red point | Disturbed land (anomaly = 1) |
| Green point | Undisturbed land (anomaly = -1) |
| Larger point | Higher anomaly confidence |
| Smaller point | Lower anomaly confidence |
| X position | NDVI value |
| Y position | NBR value |

## 🛠️ Customization Options

### To change colors:
Edit `NDVIvsNBRScatter.jsx` and modify the marker color properties:
```javascript
color: '#EF4444'  // Red for disturbed
color: '#22C55E'  // Green for undisturbed
```

### To change point size scaling:
Adjust the multiplier in:
```javascript
size: anomalyPresent.map((d) => Math.max(4, d.anomalyScore * 15))
```

### To change plot appearance:
Modify the `layout` object in the `Plot` component configuration.

## 📈 Example Use Cases

1. **Identify Mining Impact**: Red clusters show areas of mining disturbance
2. **Environmental Monitoring**: Track changes in vegetation and burn indices
3. **Anomaly Detection**: Spot unusual patterns in spectral data
4. **Area Comparison**: Compare disturbed vs undisturbed areas spatially

## 🐛 Troubleshooting

### Plot doesn't show up:
- Check browser console for errors
- Ensure CSV file path is correct
- Verify mine_id is being passed correctly

### Data not loading:
- Check that `pixel_timeseries (1).csv` exists in `src/data/`
- Verify CSV has the required columns: ndvi, nbr, anomaly_label, anomaly_score

### Tab doesn't appear:
- Clear browser cache (Ctrl+Shift+Delete)
- Restart the development server

## 📝 Next Steps

- Test with different mines to see the visualization
- Collect feedback on the visualization clarity
- Consider adding time-series animation (future feature)
- Optimize performance for large datasets if needed

## ✨ Features Summary

✅ Interactive scatter plot visualization
✅ Color-coded anomaly classification
✅ Point size based on anomaly confidence
✅ Hover tooltips with exact values
✅ Zoom and pan capabilities
✅ Toggle series via legend
✅ Export plot as image
✅ Responsive design
✅ Fast CSV loading and parsing
✅ Tab-based interface integration

---

**Questions?** Check the implementation details in `NDVI_NBR_IMPLEMENTATION.md`
