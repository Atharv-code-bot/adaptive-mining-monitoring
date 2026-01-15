# Search & Analysis Features - Complete Guide

## ✨ New Features Implemented

### 1. **Advanced Search** 🔍
Search mines by:
- **Mine ID** - Search by numeric ID (e.g., "0", "1", "5")
- **Mine Name** - Search by display name
- **State** - Search by state name
- **District** - Search by district name

### 2. **Collapsible Search Sidebar** 📋
- Click **"▶ Search"** button to open the search panel
- Click **"◀ Hide"** button to close it
- View filtered list of mines with count
- Click any mine in the list to select it on the map

### 3. **Analysis Page** 📊
- Click the **"📊 Analysis"** button in the mine details panel
- Opens a full-page analysis view for the selected mine
- Displays side-by-side mine information and spectral analysis
- Includes detailed insights and interpretation guide

## 🎯 How to Use

### Searching for a Mine

1. **Open the search sidebar**
   - Click the **"▶ Search"** button in the top-left corner

2. **Enter search criteria**
   - Type in the search box to find mines by ID, name, state, or district
   - Or select a state from the dropdown filter
   - Results update in real-time

3. **View results**
   - See the count of matching mines
   - Click any mine card to select it on the map
   - Selected mine is highlighted in blue

4. **Clear filters**
   - Click "Clear Filters" to reset search and state filter

### Viewing Mine Analysis

1. **Select a mine**
   - Click a mine marker on the map, OR
   - Search and click a mine from the sidebar list

2. **Open the details panel**
   - Mine details panel appears in the bottom-right corner
   - Shows basic information and tabs

3. **Launch full analysis**
   - Click the **"📊 Analysis"** button (green button in header)
   - Opens full-page analysis view

4. **Explore the analysis**
   - Left sidebar: Mine information (ID, state, district, coordinates)
   - Right content: NDVI vs NBR scatter plot with detailed insights
   - Hover over points to see exact spectral values
   - Use Plotly tools to zoom, pan, and interact with the plot

5. **Return to map**
   - Click **"← Back to Map"** button
   - Returns to map view with previous selections preserved

## 📊 Understanding the Analysis Page

### Layout
```
┌─────────────────────────────────────────────────┐
│  Header: Back | Mine Name (ID: xxx)             │
├──────────────────┬────────────────────────────┬─┤
│                  │                            │ │
│  Mine Details    │   Scatter Plot             │ │
│  (Sticky)        │   (NDVI vs NBR)            │ │
│                  │                            │ │
│  • ID            │   ┌────────────────┐      │ │
│  • State         │   │      Plot      │      │ │
│  • District      │   │                │      │ │
│  • Coordinates   │   │                │      │ │
│  • Map Link      │   │                │      │ │
│                  │   └────────────────┘      │ │
│                  │                            │ │
│                  │   Analysis Legend          │ │
│                  │   🔴 Disturbed Land        │ │
│                  │   🟢 Undisturbed Land      │ │
│                  │                            │ │
│                  │   Key Insights Box         │ │
│                  │                            │ │
└──────────────────┴────────────────────────────┴─┘
```

### Color Legend
- **🔴 Red Points**: Disturbed land (anomaly = 1)
  - Areas showing mining activity or disturbance
  - Low vegetation indices and altered spectral signatures
  
- **🟢 Green Points**: Undisturbed land (anomaly = -1)
  - Natural areas without mining activity
  - Normal vegetation and spectral values

### Point Size
- Larger points = Higher confidence in anomaly detection
- Smaller points = Lower confidence
- Represents the anomaly_score value

### Axes
- **X-Axis (NDVI)**: Normalized Difference Vegetation Index
  - Higher values = More vegetation
  - Range typically -1 to 1
  
- **Y-Axis (NBR)**: Normalized Burn Ratio
  - Indicates burn severity and land disturbance
  - Range typically -1 to 1

## 🔄 Data Flow

```
User clicks mine on map
         ↓
Mine details panel opens (bottom-right)
         ↓
User clicks "📊 Analysis" button
         ↓
AnalysisPage component loads
         ↓
NDVIvsNBRScatter component:
  • Loads CSV data
  • Filters by mine_id
  • Processes spectral data
  • Creates interactive scatter plot
         ↓
User sees full analysis with insights
         ↓
User can zoom, pan, hover for details
         ↓
User clicks "← Back to Map"
         ↓
Returns to map view
```

## 🔍 Search Examples

### Find by Mine ID
```
Search: "0"
Results: All mines with ID starting with 0
```

### Find by Mine Name
```
Search: "mine_name" or partial name
Results: Mines matching that name
```

### Find by State
```
Select State: "Maharashtra"
Results: All mines in Maharashtra
```

### Combine Filters
```
Search: "district_name"
Select State: "Karnataka"
Results: Mines in that district within the selected state
```

## 📈 Spectral Index Interpretation

### NDVI (Normalized Difference Vegetation Index)
- **Range**: -1 to 1
- **High values** (0.4-1.0): Dense vegetation, healthy plants
- **Medium values** (0-0.4): Moderate vegetation, mixed areas
- **Low values** (-0.3-0): Sparse vegetation, disturbed areas
- **Negative values**: Water, clouds, snow

### NBR (Normalized Burn Ratio)
- **Range**: -1 to 1
- **High values** (0.4-1.0): Undisturbed vegetation
- **Low/Negative values** (-1 to 0): Disturbed areas, burned areas
- **Used to detect**: Mining activity, excavation, vegetation loss

## 🎨 Color Interpretation Strategy

When looking at the scatter plot:

1. **Well-separated clusters**
   - ✅ Good! Shows clear distinction between disturbed/undisturbed
   
2. **Overlapping clusters**
   - ⚠️ Mixed areas with transitional characteristics
   
3. **Red in bottom-left**
   - Low vegetation + disturbed = Active mining zone
   
4. **Green in top-right**
   - High vegetation + undisturbed = Healthy natural area
   
5. **Outliers**
   - Edge pixels or transition zones between categories

## 💡 Tips & Tricks

- **Zoom the plot**: Scroll to zoom into specific regions
- **Pan the plot**: Click and drag to move around
- **Toggle series**: Click legend items to show/hide anomaly types
- **Hover for details**: See exact NDVI, NBR, and anomaly score values
- **Export plot**: Use Plotly's download button to save as PNG
- **Compare mines**: Search multiple mines and open analysis for each

## 🐛 Troubleshooting

### Search not showing results
- Check spelling of mine name or ID
- Try using partial keywords
- Verify state filter isn't too restrictive
- Clear filters and try again

### Analysis page not loading
- Ensure mine was properly selected
- Check browser console for errors
- Reload the page if needed

### Scatter plot not displaying
- Wait a moment for CSV to load
- Check that mine_id matches data in CSV
- Verify CSV file path is correct

### Sidebar not opening
- Click "▶ Search" button again
- Check if button is visible (top-left corner)
- Try refreshing the page

## 📁 Files Modified/Created

### New Files
- `frontend/src/components/AnalysisPage.jsx` - Full-page analysis view
- `NDVI_NBR_SETUP_GUIDE.md` - Setup guide for scatter plot feature

### Modified Files
- `frontend/src/App.jsx` - Added routing, search filtering, analysis state
- `frontend/src/components/MineDetailsPanel.jsx` - Added Analysis button
- `frontend/src/components/SearchBar.jsx` - Updated placeholder text

## 🚀 Next Steps

1. **Test the search feature**
   - Try searching by different criteria
   - Test with various mine IDs and names

2. **Explore the analysis page**
   - Click Analysis button on different mines
   - Compare patterns between mines

3. **Collect feedback**
   - Note any missing features
   - Identify improvements needed
   - Test performance with large datasets

4. **Future enhancements**
   - Time-series animation
   - Statistical summary cards
   - Export analysis reports
   - Multiple mine comparison
   - Filtering by date range

---

**Questions?** Check the implementation details in `NDVI_NBR_IMPLEMENTATION.md`
