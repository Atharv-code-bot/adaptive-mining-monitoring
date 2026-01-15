import React, { useState } from 'react';

export function AdminPage({ onClose }) {
  const [selectedMines, setSelectedMines] = useState(
    Array.from({ length: 11 }, (_, i) => true) // Select all mines 0-10 by default
  );
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-08-01');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const toggleMine = (index) => {
    const newSelected = [...selectedMines];
    newSelected[index] = !newSelected[index];
    setSelectedMines(newSelected);
  };

  const handleRunPipeline = async () => {
    setLoading(true);
    setError(null);
    setProgress([]);
    setCompleted([]);

    const selectedMineIds = selectedMines
      .map((selected, index) => (selected ? index : null))
      .filter(id => id !== null);

    for (const mineId of selectedMineIds) {
      try {
        setProgress(prev => [...prev, `Processing Mine ${mineId}...`]);

        const response = await fetch(
          `${API_URL}/admin/run?mine_id=${mineId}&start_date=${startDate}&end_date=${endDate}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCompleted(prev => [...prev, `✅ Mine ${mineId}: ${data.message || 'Success'}`]);
      } catch (err) {
        setCompleted(prev => [...prev, `❌ Mine ${mineId}: ${err.message}`]);
      }
    }

    setLoading(false);
    setProgress([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-100">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 border-b-2 border-emerald-500">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black">🔧 Admin Pipeline Runner</h1>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg w-10 h-10 flex items-center justify-center transition text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-300 text-sm mt-2">Run ML model and process satellite data</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Date Range Selection */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl border-2 border-cyan-200 shadow-sm">
            <h2 className="font-bold text-cyan-900 mb-4 text-lg">📅 Date Range</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cyan-800 font-bold mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-800 font-bold mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Mine Selection */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border-2 border-emerald-200 shadow-sm">
            <h2 className="font-bold text-emerald-900 mb-4 text-lg">🏭 Select Mines</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 11 }, (_, i) => i).map((mineId) => (
                <button
                  key={mineId}
                  onClick={() => toggleMine(mineId)}
                  disabled={loading}
                  className={`px-4 py-3 rounded-lg font-bold transition shadow-sm hover:shadow-md ${
                    selectedMines[mineId]
                      ? 'bg-emerald-600 text-white border-2 border-emerald-700'
                      : 'bg-white text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-50'
                  } disabled:opacity-50`}
                >
                  Mine {mineId}
                </button>
              ))}
            </div>
            <p className="text-sm text-emerald-700 mt-4 font-semibold">
              ✓ Selected: <span className="font-black text-lg">{selectedMines.filter(Boolean).length}</span> / 11 mines
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-700"><strong>Error:</strong> {error}</p>
            </div>
          )}

          {/* Progress */}
          {progress.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
              <p className="text-yellow-900 font-bold mb-3">⏳ Processing...</p>
              {progress.map((msg, idx) => (
                <p key={idx} className="text-sm text-yellow-800">{msg}</p>
              ))}
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
              <p className="font-bold text-slate-900 mb-3">📝 Results</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {completed.map((msg, idx) => (
                  <p key={idx} className="text-sm text-slate-700 font-mono bg-white px-3 py-2 rounded border border-slate-200">{msg}</p>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t-2 border-slate-200">
            <button
              onClick={handleRunPipeline}
              disabled={loading || selectedMines.filter(Boolean).length === 0}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  🚀 Run Pipeline
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-4 bg-slate-400 hover:bg-slate-500 text-white rounded-xl font-bold transition disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              type="button"
            >
              ← Back to Map
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-200 text-sm text-indigo-900">
            <p className="font-bold text-lg mb-3">ℹ️ What This Does:</p>
            <ul className="list-disc list-inside space-y-2 text-xs">
              <li>Fetches satellite imagery from Google Earth Engine</li>
              <li>Computes spectral indices (NDVI, NBR, etc.)</li>
              <li>Runs ML anomaly detection algorithm</li>
              <li>Detects mining excavation patterns</li>
              <li>Stores analysis results in database</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
