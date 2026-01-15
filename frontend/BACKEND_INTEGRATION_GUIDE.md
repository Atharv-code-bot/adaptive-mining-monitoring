# Frontend-Backend Integration Guide

## Setup Instructions

### 1. Backend Setup

Install dependencies and run the backend:

```bash
cd backend/adaptive-mining-monitoring/backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 2. Frontend Setup

The frontend is already configured to connect to the backend:

```bash
cd frontend
npm install  # If not already done
npm run dev
```

Frontend will be available at: `http://localhost:5174`

## Environment Configuration

Frontend environment variables (`.env.local`):

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_API_URL=http://localhost:8000
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if backend is running

### Mine Details
- **GET** `/mine/details/{mine_id}` - Fetch mine details (name, location, state, district, geometry)

### Pixel Data
- **GET** `/mine/pixels?mine_id={mine_id}&start={start_date}&end={end_date}`
  - Returns spectral data (NDVI, NBR, B4, B8, B11, anomaly labels, scores)

### KPI Metrics
- **GET** `/mine/kpi/{mine_id}?start={start_date}&end={end_date}`
  - Returns summary metrics:
    - Total pixels
    - Excavated pixels count & percentage
    - Average NDVI (normal vs excavated)
    - Max anomaly score
    - Date range

### Spectral Signature
- **GET** `/mine/spectral-signature/{mine_id}?start={start_date}&end={end_date}`
  - Returns aggregated spectral data for radar chart
  - Shows mean values for B4, B8, B11, NDVI, NBR by anomaly type

## Frontend Components

### New Components Added

1. **KPIDashboard.jsx**
   - Displays 5 KPI cards
   - Fetches data from `/mine/kpi/{mine_id}`
   - Shows: Total pixels, excavated pixels, NDVI metrics, anomaly score

2. **SpectralRadarChart.jsx**
   - Radar/Spider chart visualization
   - Compares normal vs anomalous spectral signatures
   - Fetches from `/mine/spectral-signature/{mine_id}`
   - Toggle views for each data series

3. **Updated AnalysisPage.jsx**
   - Added tab navigation (Dashboard, NDVI vs NBR, Spectral Signature)
   - Integrates all three visualizations
   - Displays mine details sidebar

## Data Flow

```
User clicks mine pin
       ↓
Mine selected in App.jsx
       ↓
User clicks "📊 Analysis" button
       ↓
AnalysisPage loads with three tabs:
  ├─ Dashboard (KPI Cards) → /mine/kpi/{mine_id}
  ├─ NDVI vs NBR (Scatter) → pixel_timeseries.csv
  └─ Spectral Signature (Radar) → /mine/spectral-signature/{mine_id}
```

## Currently Fetching Mine ID 0

All components are configured to work with any mine_id. By default:
- When you select a mine from the search/map
- The mine_id from that selection is used
- For testing, select Mine 0 (Sidhi, Madhya Pradesh)

## Fallback Data

If backend is not available:
- Frontend falls back to local `mines.json` for mine list
- Spectral visualization still uses local `pixel_timeseries (1).csv`
- API calls will show error messages in console

## Testing the Integration

1. Start backend: `uvicorn app:app --reload --port 8000`
2. Start frontend: `npm run dev`
3. Navigate to http://localhost:5174
4. Click "▶ Search" to show sidebar
5. Select Mine 0
6. Click "📊 Analysis" button
7. Explore three tabs:
   - Dashboard: View KPI metrics
   - NDVI vs NBR: See scatter plot
   - Spectral Signature: Check radar chart

## Troubleshooting

### CORS Error
- If you see CORS errors, backend's CORS middleware is configured in `app.py`
- Currently allows all origins (`allow_origins=["*"]`)

### API Not Found (404)
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `.env.local`

### Database Connection Error
- Backend requires PostgreSQL with PostGIS extension
- Ensure database credentials in `config/settings.py` are correct

### Missing Data
- Some data might not exist in database for certain mine IDs
- Components show "No data available" when appropriate
