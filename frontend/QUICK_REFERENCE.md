# Quick Reference Guide

## 🚀 Getting Started

### Start Development Server
```bash
cd frontend
npm run dev
```
Server will be at: `http://localhost:5174/`

## 🎯 Key Features at a Glance

### 1️⃣ Search Mines (Top-Left)
```
Click "▶ Search" button
↓
Type mine ID, name, state, or district
↓
Results appear in list below search box
↓
Click mine to select on map
```

### 2️⃣ View Details (Bottom-Right)
```
Click a mine on map
↓
Details panel opens
↓
Shows 2 tabs:
  • 📋 Mine Info - Basic details
  • 📊 NDVI vs NBR - Spectral plot
```

### 3️⃣ Full Analysis (Analysis Page)
```
Details panel open
↓
Click "📊 Analysis" button (green)
↓
Full-page analysis opens
↓
Left: Mine details (sticky)
Right: Large scatter plot
↓
Click "← Back to Map" to return
```

## 🔍 Search Tips

| What to Search | Example |
|---|---|
| Mine ID | Type "0", "1", "42" |
| Mine Name | Type "mine" or part of name |
| State | Select from dropdown or type |
| District | Type "district name" |
| Multiple criteria | Use search + state filter |

## 📊 Understanding the Scatter Plot

```
        NBR (Y-axis)
        ↑
      1 ├──────────────────
        │  🟢 Undisturbed
        │     (Green)
      0 ├──────────────────
        │
        │ 🔴 Disturbed
     -1 │    (Red)
        └──────────────────→ NDVI (X-axis)
       -1      0      1
```

**Color Meanings:**
- 🔴 **Red** = Disturbed land (anomaly = 1)
- 🟢 **Green** = Undisturbed land (anomaly = -1)
- **Point size** = Confidence score

## 🎮 Plot Interactions

| Action | Result |
|---|---|
| **Scroll** | Zoom in/out |
| **Click & Drag** | Pan around plot |
| **Hover** | See exact values (NDVI, NBR, Score) |
| **Click legend** | Show/hide that anomaly type |
| **Camera icon** | Download plot as PNG |

## 📱 UI Layout

### Map View
```
┌─────────────────────────────────────┐
│ Header                              │
├──────────┬────────────────────────┬─┤
│ Search   │                        │ │
│ (Toggle) │   Full-Screen Map      │ │
│          │                        │D│
│ Mine     │                        │e│
│ List     │   • Mine Markers 🔴    │t│
│          │   • Info Windows       │a│
│ Filters  │   • Zoom Controls      │i│
│          │                        │l│
└──────────┴────────────────────────┴─┘
```

### Analysis View
```
┌─────────────────────────────────────┐
│ Back | Mine Name (ID: 123)   📊     │
├──────────────────┬───────────────────┤
│                  │                   │
│ Mine Details     │  Scatter Plot     │
│ (Sticky)         │  (Interactive)    │
│                  │  NDVI vs NBR      │
│ • ID: 123        │                   │
│ • State: XYZ     │  🔴 🟢 Legend     │
│ • District: ABC  │                   │
│ • Coordinates    │  📈 Insights      │
│ • Map Link       │                   │
│                  │  💡 Tips          │
└──────────────────┴───────────────────┘
```

## 🎯 Common Tasks

### Find a specific mine
1. Click "▶ Search" button
2. Type mine ID or name
3. Click result in list
4. Mine appears on map with red marker

### View mine analysis
1. Click mine on map (or search for it)
2. Click "📊 Analysis" button
3. Full analysis page opens
4. Explore scatter plot

### Check mine location
1. Select mine
2. Click "📍 View on Google Maps"
3. Opens Google Maps in new tab

### Compare two mines
1. View analysis for mine #1
2. Take note of cluster patterns
3. Go back to map
4. View analysis for mine #2
5. Compare patterns mentally

### Clear all filters
1. Click "▶ Search" to open sidebar
2. Click "Clear Filters" button
3. All mines displayed again

## 🔧 Keyboard Shortcuts

Currently, no custom shortcuts. Standard browser/map shortcuts work:
- **Scroll** = Zoom map / Zoom plot
- **Mouse wheel** = Pan and zoom
- **Right-click** = Context menu

## 📊 Data Interpretation

### What the colors mean:

**Red Cluster (Bottom-Left)**
- Low vegetation (low NDVI)
- Disturbed area (low/negative NBR)
- Likely: Active mining, bare ground, excavation

**Green Cluster (Top-Right)**
- High vegetation (high NDVI)
- Undisturbed area (high NBR)
- Likely: Dense forest, healthy vegetation

**Scattered Points**
- Transition areas
- Mixed characteristics
- Edge pixels between categories

### Point sizes mean:

**Large points**
- High confidence in classification
- Definitely disturbed or undisturbed

**Small points**
- Low confidence in classification
- Borderline or uncertain areas

## 💾 Data Not Saved

All interactions are temporary:
- Searches don't persist
- Selections don't save
- Refreshing page resets everything
- No data sent to servers

## 🐛 Common Issues & Fixes

| Issue | Solution |
|---|---|
| Search not working | Clear filters, check spelling |
| Plot not showing | Wait a moment to load, check browser console |
| Details panel stuck | Click X button, or click map background |
| Sidebar won't open | Click "▶ Search" button again |
| Map not responding | Zoom in/out or pan a bit |

## 📞 Need Help?

1. Check the browser console (F12) for errors
2. Verify CSV file exists in `src/data/`
3. Refresh the page
4. Clear browser cache
5. Check that mine IDs in CSV match your data

## 🎓 Learning Resources

Inside the application:
- **SearchBar.jsx** - Shows "Search by mine name, ID, state, or district..."
- **AnalysisPage.jsx** - Includes "Analysis Info" and "Key Insights" boxes
- **NDVIvsNBRScatter.jsx** - Scatter plot with color legend

## ✅ Checklist for Testing

- [ ] Open app at http://localhost:5174/
- [ ] Click "▶ Search" button - sidebar opens
- [ ] Type in search box - results filter in real-time
- [ ] Click a mine in list - it selects on map
- [ ] Click a mine marker - details panel opens
- [ ] Click "📊 NDVI vs NBR" tab - plot shows
- [ ] Click "📊 Analysis" button - full page opens
- [ ] Hover over plot points - tooltips appear
- [ ] Zoom plot with scroll - works smoothly
- [ ] Click legend items - series toggle
- [ ] Click "← Back to Map" - returns to map view
- [ ] State filter works - showing only selected state mines
- [ ] Clear filters works - all mines show again

---

**Last Updated**: January 14, 2026
**Status**: ✅ Production Ready
