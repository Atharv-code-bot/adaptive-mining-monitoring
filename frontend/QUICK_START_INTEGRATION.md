# 🚀 Quick Start - Frontend Backend Integration

## ⚡ 30-Second Setup

### Terminal 1: Backend
```bash
cd backend/adaptive-mining-monitoring/backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Browser
```
http://localhost:5174
```

---

## 🎮 Using the Integration

### Step 1: Search
Click "▶ Search" to show sidebar

### Step 2: Select Mine
Search for "Mine 0" or select from list

### Step 3: Analyze
Click green "📊 Analysis" button

### Step 4: Explore
- **Tab 1 (📊):** 5 KPI Cards from backend
- **Tab 2 (📈):** Scatter plot from local CSV
- **Tab 3 (🎯):** Radar chart from backend

---

## 🔗 What's Connected

| Component | Data Source | Type |
|-----------|------------|------|
| KPI Cards | `/mine/kpi/0` | API |
| Scatter Plot | `pixel_timeseries.csv` | Local |
| Radar Chart | `/mine/spectral-signature/0` | API |

---

## 📊 What You'll See

### Dashboard Tab (KPI Cards)
```
┌────────────────────────────────────────┐
│ 📊 Total Pixels      │ 🚜 Excavated    │
│ 123 pixels           │ 45 (36.6%)      │
├────────────────────────────────────────┤
│ 🌱 Avg NDVI Normal   │ ⚠️  Avg Excavated│
│ 0.823                │ 0.234           │
├────────────────────────────────────────┤
│ 🎯 Max Anomaly Score                   │
│ 0.0815                                 │
└────────────────────────────────────────┘
```

### NDVI vs NBR Tab
```
   NBR ▲
       │     🔴 🔴 (Disturbed)
       │   🔴   🔴
       │      🔴
   0.5 ├─ ─ ─ ─ ─ ─ ─
       │  🟢   🟢    (Normal)
     0 ├─── ─ 🟢 ─ ─ ─
       │    🟢
       └──────────────▶ NDVI
```

### Spectral Radar Tab
```
          B4
         /  \
       B8    B11
      /        \
     NBR—— NDVI
    
    Blue line: Normal pixels
    Red line: Anomalous pixels
```

---

## 🔧 New Files Created

| File | Purpose |
|------|---------|
| `apiClient.js` | API communication |
| `KPIDashboard.jsx` | KPI cards display |
| `SpectralRadarChart.jsx` | Radar visualization |

---

## ✏️ Modified Files

| File | Change |
|------|--------|
| `AnalysisPage.jsx` | Added 3 tabs |
| `app.py` (backend) | Added CORS |
| `user_routes.py` (backend) | Added 3 endpoints |

---

## 🌐 API Endpoints

```
GET /mine/kpi/0
  → 5 KPI metrics

GET /mine/spectral-signature/0
  → Spectral aggregates

GET /mine/details/0
  → Mine metadata

GET /mine/pixels?mine_id=0
  → Pixel spectral data
```

---

## ⚙️ Config

### `.env.local`
```env
VITE_API_URL=http://localhost:8000
```

### Backend CORS
Already enabled ✅

---

## ✅ Verify It Works

1. Backend running: `http://localhost:8000/health`
2. Frontend running: `http://localhost:5174`
3. Select Mine 0
4. Click Analysis
5. See 3 tabs with data

---

## 🐛 Debug Tips

| Issue | Check |
|-------|-------|
| No data | Backend running? Database connected? |
| API 404 | Backend port 8000? Endpoint exists? |
| CORS error | Backend CORS enabled? |
| CSV not loading | File path correct? |

---

## 📖 Learn More

- **Setup:** `BACKEND_INTEGRATION_GUIDE.md`
- **Architecture:** `SYSTEM_ARCHITECTURE.md`
- **Testing:** `SETUP_CHECKLIST.md`

---

## 🎯 What's Working

✅ Frontend-Backend communication  
✅ KPI dashboard (real data)  
✅ Spectral radar (real data)  
✅ NDVI vs NBR scatter (local CSV)  
✅ Error handling  
✅ Tab navigation  
✅ Mine ID 0 data  

---

**Status: READY TO USE** 🚀
