# System Architecture Diagram

## Overall System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         WEB BROWSER                                     │
│                   http://localhost:5174                                 │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                   REACT FRONTEND                              │    │
│  │                                                               │    │
│  │  ┌────────────────┐                                          │    │
│  │  │  App.jsx       │  (Main Component)                        │    │
│  │  ├─ Search Bar    │                                          │    │
│  │  ├─ Map View      │                                          │    │
│  │  └─ Routing       │                                          │    │
│  │      │                                                       │    │
│  │      └─► AnalysisPage.jsx                                   │    │
│  │          │                                                   │    │
│  │          ├─► KPIDashboard.jsx                               │    │
│  │          │   └─ apiClient.getMineKPI()                      │    │
│  │          │                                                   │    │
│  │          ├─► NDVIvsNBRScatter.jsx                           │    │
│  │          │   └─ Local CSV (pixel_timeseries.csv)            │    │
│  │          │                                                   │    │
│  │          └─► SpectralRadarChart.jsx                         │    │
│  │              └─ apiClient.getSpectralSignature()            │    │
│  │                                                              │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              │                                         │
│                              │ HTTPS/CORS                              │
│                              │                                         │
└──────────────────────────────┼─────────────────────────────────────────┘
                               │
                 ┌─────────────┴──────────────┐
                 │                            │
                 ▼                            ▼
         ┌──────────────┐          ┌──────────────────┐
         │  Static      │          │   API Calls      │
         │  Files       │          │                  │
         │  mines.json  │          │  http://localhost:8000
         │  CSV         │          │                  │
         └──────────────┘          └──────────────────┘
                                            │
                                            │
         ┌──────────────────────────────────┼──────────────────────────────┐
         │                                  │                              │
         │                                  ▼                              │
         │                            ┌─────────────────┐                 │
         │                            │   FASTAPI       │                 │
         │                            │   BACKEND       │                 │
         │                            │ Port 8000       │                 │
         │                            └─────────────────┘                 │
         │                                  │                              │
         │          ┌───────────────────────┼───────────────────────┐     │
         │          │                       │                       │     │
         │          ▼                       ▼                       ▼     │
         │    ┌──────────────┐       ┌──────────────┐      ┌─────────────┤
         │    │ /mine/kpi    │       │ /mine/       │      │ /mine/      │
         │    │ /{mine_id}   │       │ pixels       │      │ details/    │
         │    │              │       │              │      │ {mine_id}   │
         │    │ Returns:     │       │ Returns:     │      │             │
         │    │ - total      │       │ - ndvi       │      │ Returns:    │
         │    │ - excavated  │       │ - nbr        │      │ - name      │
         │    │ - avg_ndvi   │       │ - anomaly    │      │ - location  │
         │    │ - max_anomaly│       │ - lat/lon    │      │ - geometry  │
         │    └──────────────┘       └──────────────┘      └─────────────┤
         │                                 │                       │      │
         │                                 └───────────┬───────────┘      │
         │                                             │                   │
         │    ┌────────────────────────────────────────┼──────────────┐   │
         │    │                                        │              │   │
         │    ▼                                        ▼              ▼   │
         │ ┌─────────────────────────────────────────────────────────┐   │
         │ │        DATABASE SERVICES (db_reader.py)                 │   │
         │ │                                                         │   │
         │ │  • fetch_pixels()                                       │   │
         │ │    └─ SELECT ndvi, nbr, b4, b8, b11, anomaly...        │   │
         │ │                                                         │   │
         │ │  • fetch_mine_details()                                 │   │
         │ │    └─ SELECT name, state, district, geometry...        │   │
         │ │                                                         │   │
         │ │  • fetch_mine_kpi()                                     │   │
         │ │    └─ Aggregate: COUNT, SUM, AVG, MAX...               │   │
         │ │                                                         │   │
         │ └─────────────────────────────────────────────────────────┘   │
         │                        │                                        │
         │                        ▼                                        │
         │              ┌──────────────────┐                              │
         │              │   PostgreSQL     │                              │
         │              │   + PostGIS      │                              │
         │              │                  │                              │
         │              │  Tables:         │                              │
         │              │  - mines         │                              │
         │              │  - pixel_        │                              │
         │              │    timeseries    │                              │
         │              └──────────────────┘                              │
         │                                                                │
         └────────────────────────────────────────────────────────────────┘
```

## Frontend Component Hierarchy

```
App.jsx (Root)
│
├─ Header
│
├─ SearchBar (Left Sidebar)
│  ├─ Search Input
│  ├─ State Filter
│  └─ MinesList
│
├─ MapComponent (Google Maps)
│  └─ Mine Markers
│
├─ MineDetailsPanel (Floating)
│  ├─ Info Tab
│  │  └─ Mine properties
│  │
│  └─ Spectral Tab
│     └─ NDVIvsNBRScatter
│        └─ Plotly Scatter (small)
│
└─ AnalysisPage (Full Page)
   │
   ├─ Header
   │  └─ Mine Name + Back Button
   │
   ├─ Sidebar (Sticky)
   │  └─ Mine Details Cards
   │
   └─ Tab Navigation
      │
      ├─ Dashboard Tab
      │  └─ KPIDashboard
      │     ├─ Total Pixels Card
      │     ├─ Excavated Pixels Card
      │     ├─ Avg NDVI Normal Card
      │     ├─ Avg NDVI Excavated Card
      │     └─ Max Anomaly Score Card
      │
      ├─ NDVI vs NBR Tab
      │  └─ NDVIvsNBRScatter
      │     └─ Plotly Scatter (large)
      │
      └─ Spectral Signature Tab
         └─ SpectralRadarChart
            ├─ Radar Plot
            └─ Normal/Anomalous Comparison
```

## Data Flow for Analysis Page

```
┌─────────────────────────────────────────────────────────────────┐
│ User Selects Mine 0 and Clicks Analysis Button                 │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  AnalysisPage      │
        │  Props:            │
        │  - mine (GeoJSON)  │
        │  - mine_id: 0      │
        └────────┬───────────┘
                 │
    ┌────────────┼────────────┬───────────┐
    │            │            │           │
    ▼            ▼            ▼           ▼
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Dashboard│ │NDVI vsNBR│ │Spectral  │ │ Sidebar  │
│Tab      │ │Tab       │ │Signature │ │Details   │
│         │ │          │ │Tab       │ │          │
│KPIDash- │ │NDVIvsNBR │ │Spectral  │ │Location  │
│board    │ │Scatter   │ │RadarChart│ │Coords    │
│         │ │          │ │          │ │Maps Link │
└────┬────┘ └────┬─────┘ └────┬─────┘ └──────────┘
     │           │            │
     │           │            │
     │GET        │LOAD         │GET
     │/mine/kpi/0│CSV          │/mine/spectral/0
     │           │Filter 0     │
     │           │             │
     │ ┌─────────┴─────────┬───┴─────────┐
     │ │                   │             │
     ▼ ▼                   ▼             ▼
   Backend             Frontend        Backend
   Returns:            Local CSV        Returns:
   {                   Pixel Data       {
     total: 123,       → ndvi: []       normal: {
     excavated: 45,       nbr: []        b4: -0.9,
     avg_ndvi_n: 0.82,    anomaly: []    b8: -0.3,
     avg_ndvi_e: 0.23,    score: []      ...
     max_anomaly: 0.08  Plotly Plot     },
   }                   Shows:           anomalous: {
                       Red+Green         ...
   Cards Display       Scatter Plot     }
                                        }
                                        
                                        Radar Chart
                                        Shows:
                                        Normal+Anomalous
                                        Overlay
```

## API Call Sequence Diagram

```
Timeline: User opens Analysis for Mine 0

0ms    │  AnalysisPage Mounts
       │  ├─ mine_id = 0
       │  └─ activeTab = "overview" (Dashboard)
       │
       │  KPIDashboard Mounts
       │  └─ useEffect → apiClient.getMineKPI(0)
       │
       ▼  HTTP REQUEST 1
      ▲
      │  GET /mine/kpi/0
      │  ├─ Origin: localhost:5174
      │  └─ Header: Authorization: ...
      │
      ▼  Backend Processing (db_reader.py)
      │  ├─ COUNT(*) all pixels
      │  ├─ COUNT WHERE anomaly_label = 1
      │  ├─ AVG(ndvi) WHERE anomaly = -1
      │  ├─ AVG(ndvi) WHERE anomaly = 1
      │  └─ MAX(anomaly_score)
      │
      ▼  HTTP RESPONSE 1
      │  ┌─────────────────────────────────┐
      │  │ {                               │
      │  │   "total_pixels": 123,          │
      │  │   "excavated_pixels": 45,       │
      │  │   "excavated_percentage": 36.6, │
      │  │   "avg_ndvi_normal": 0.823,     │
      │  │   "avg_ndvi_excavated": 0.234,  │
      │  │   "max_anomaly_score": 0.0815   │
      │  │ }                               │
      │  └─────────────────────────────────┘
      │
      ▼  Data Rendered in KPIDashboard
      │  ├─ 5 Cards Display
      │  ├─ Color Coded
      │  └─ Ready for interaction
      │
   
   (User clicks "Spectral Signature" tab)
      │
      ▼  HTTP REQUEST 2
      │  GET /mine/spectral-signature/0
      │  
      ▼  Backend Processing
      │  ├─ fetch_pixels(0)
      │  ├─ df[df.anomaly = -1] → mean B4, B8, B11, NDVI, NBR
      │  └─ df[df.anomaly = 1] → mean B4, B8, B11, NDVI, NBR
      │
      ▼  HTTP RESPONSE 2
      │  ┌─────────────────────────────────┐
      │  │ {                               │
      │  │   "normal": {                   │
      │  │     "b4": -0.95,                │
      │  │     "b8": -0.28,                │
      │  │     "b11": -1.15,               │
      │  │     "ndvi": 0.823,              │
      │  │     "nbr": 0.612                │
      │  │   },                            │
      │  │   "anomalous": {                │
      │  │     "b4": -1.05,                │
      │  │     "b8": -0.65,                │
      │  │     "b11": -1.28,               │
      │  │     "ndvi": 1.234,              │
      │  │     "nbr": 1.456                │
      │  │   }                             │
      │  │ }                               │
      │  └─────────────────────────────────┘
      │
      ▼  Radar Chart Renders
      │  ├─ Normal curve (blue)
      │  ├─ Anomalous curve (red)
      │  ├─ 5 axes (B4, B8, B11, NDVI, NBR)
      │  └─ Legend and tooltip ready
      │
      ▼  All Tabs Ready for User Interaction
```

## Component Communication

```
App.jsx (State Management)
│
├─ State: selectedMine, analyzingMine, searchTerm, selectedState
│
├─► MineDetailsPanel (Props)
│   ├─ mine: GeoJSON
│   ├─ onClose: Function
│   └─ onAnalysis: Function
│       │
│       └─► AnalysisPage (Props)
│           ├─ mine: GeoJSON
│           ├─ onBack: Function
│           │
│           └─► 3 Child Components
│               ├─► KPIDashboard
│               │   ├─ Props: mineId
│               │   └─ API: apiClient.getMineKPI()
│               │
│               ├─► NDVIvsNBRScatter
│               │   ├─ Props: mineId
│               │   └─ Data: Local CSV
│               │
│               └─► SpectralRadarChart
│                   ├─ Props: mineId
│                   └─ API: apiClient.getSpectralSignature()
```

---

**Total API Calls per Analysis View: 2**
1. `/mine/kpi/{id}` - KPI metrics
2. `/mine/spectral-signature/{id}` - Spectral aggregates

**Local Data Used: 1**
- `pixel_timeseries.csv` - For scatter plot (no API needed)
