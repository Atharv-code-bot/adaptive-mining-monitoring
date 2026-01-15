# Quick Setup Guide

## 📌 TL;DR - Get Started in 3 Steps

### Step 1: Get Google Maps API Key
1. Visit: https://console.cloud.google.com/
2. Create new project
3. Enable "Maps JavaScript API"
4. Go to Credentials → Create API Key
5. Copy the key

### Step 2: Add API Key
Edit `frontend/.env.local`:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 3: Run the App
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

---

## 🎯 What You'll See

- **Left Panel:** Search mines and see list
- **Center:** Interactive Google Map with 114+ mine markers
- **Right Panel:** Details of selected mine

## 🔍 How to Use

1. **Search:** Type mine name in search box
2. **Filter by State:** Select state from dropdown
3. **Click Marker:** Click any marker on map to select
4. **View Details:** Selected mine shows in right panel
5. **Open in Maps:** Click "View on Google Maps" button

## 📁 All Component Files

```
src/components/
├── Header.jsx          - App header with title
├── MapComponent.jsx    - Google Maps display
├── SearchBar.jsx       - Search & filter controls
├── MinesList.jsx       - List of mines
├── MineCard.jsx        - Single mine card
└── MineDetails.jsx     - Detailed mine info

src/utils/
├── mapsUtils.js        - Map helper functions
└── dataLoader.js       - Data loading logic

src/data/
└── mines.json          - Your GeoJSON data (114+ mines)
```

## ⚙️ Configuration

The app loads configuration from:
- `VITE_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

## 🐛 Troubleshooting

**Map not showing?**
- Check API key in `.env.local`
- Verify API is enabled in Google Cloud

**No mines visible?**
- Check browser console (F12) for errors
- Ensure mines.json is loaded correctly

---

**Everything is ready! Just add your API key and run `npm run dev`** ✨
