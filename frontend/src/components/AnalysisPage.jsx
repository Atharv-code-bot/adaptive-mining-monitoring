import React, { useState, useEffect } from 'react';
import { MineSummaryDashboard } from './MineSummaryDashboard';
import { NDVIvsNBRScatterPlot } from './NDVIvsNBRScatterPlot';
import { SpectralSignatureRadarChart } from './SpectralSignatureRadarChart';
import { NDVIHeatmap } from './NDVIHeatmap';
import { ExcavationVsNormalDistribution } from './ExcavationVsNormalDistribution';

const AnalysisPage = ({ mine, onBack }) => {
  const { properties, geometry } = mine;
  const [lng, lat] = geometry.coordinates;
  const [activeTab, setActiveTab] = useState('overview');
  const [mineData, setMineData] = useState([]);
  const [kpiData, setKpiData] = useState(null);
  const [mineDetails, setMineDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-08-01');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Generate mock data for visualization
  const generateMockData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        ndvi: 0.2 + Math.random() * 0.6,
        nbr: 0.1 + Math.random() * 0.7,
        anomaly_label: Math.random() > 0.7 ? 1 : -1,
        anomaly_score: Math.random() * 100,
        excavated_percentage: Math.random() * 100,
        spectral_b4: 0.1 + Math.random() * 0.4,
        spectral_b8: 0.2 + Math.random() * 0.5,
        spectral_b11: 0.15 + Math.random() * 0.35,
        total_pixels: Math.floor(Math.random() * 10000),
        excavated_pixels: Math.floor(Math.random() * 5000),
        date: new Date(2025, 0, 1 + Math.floor(Math.random() * 240)).toISOString(),
      });
    }
    return data;
  };

  const fetchData = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch pixel data
      const pixelResponse = await fetch(
        `${API_URL}/mine/pixels?mine_id=${properties.mine_id}&start=${start}&end=${end}`
      );
      if (pixelResponse.ok) {
        const pixelData = await pixelResponse.json();
        setMineData(pixelData);
      } else {
        console.warn('Backend /mine/pixels endpoint not available, using mock data');
        setMineData(generateMockData());
      }

      // Fetch KPI data
      try {
        const kpiResponse = await fetch(
          `${API_URL}/mine/kpi/${properties.mine_id}?start=${start}&end=${end}`
        );
        if (kpiResponse.ok) {
          const kpi = await kpiResponse.json();
          setKpiData(kpi);
        } else {
          console.warn('Could not fetch KPI (status: ' + kpiResponse.status + ')');
        }
      } catch (err) {
        console.warn('Could not fetch KPI:', err.message);
      }

      // Mine details already available from props, no need to fetch
      // The mines.json data has all the details needed
      setMineDetails({
        type: "Feature",
        properties: properties,
        geometry: geometry
      });
    } catch (err) {
      console.warn('Using mock data due to API error:', err.message);
      setMineData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  const handleApplyDateRange = () => {
    fetchData(startDate, endDate);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg border-b-4 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                console.log("Back button clicked");
                onBack();
              }}
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition font-medium text-sm flex items-center gap-2 shadow-lg"
            >
              ← Back to Map
            </button>
            <div>
              <h1 className="text-3xl font-black">{properties.display_name}</h1>
              <p className="text-slate-300 text-sm">Mine ID: {properties.mine_id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Mine Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 sticky top-8 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 border-b-2 border-emerald-500 pb-3">📍 Mine Details</h2>

              {/* Mine ID */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
                <p className="text-xs text-orange-700 uppercase tracking-wide font-bold">Mine ID</p>
                <p className="text-2xl font-black text-orange-700 mt-2">{properties.mine_id}</p>
              </div>

              {/* State */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200 shadow-sm">
                <p className="text-xs text-emerald-700 uppercase tracking-wide font-bold">State</p>
                <p className="text-lg font-semibold text-emerald-700 mt-2">{properties.state}</p>
              </div>

              {/* District */}
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200 shadow-sm">
                <p className="text-xs text-cyan-700 uppercase tracking-wide font-bold">District</p>
                <p className="text-lg font-semibold text-cyan-700 mt-2">{properties.district}</p>
              </div>

              {/* Sub-district */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
                <p className="text-xs text-purple-700 uppercase tracking-wide font-bold">Sub-district</p>
                <p className="text-lg font-semibold text-purple-700 mt-2">{properties.subdistrict}</p>
              </div>

              {/* Coordinates */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-300 shadow-sm">
                <p className="text-xs text-slate-700 uppercase tracking-wide font-bold mb-3">🗺️ Coordinates</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-600">Latitude:</span>
                    <p className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded mt-1">{lat.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-600">Longitude:</span>
                    <p className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded mt-1">{lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>

              {/* View on Maps Button */}
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/@${lat},${lng},15z`,
                    '_blank'
                  );
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                📍 View on Google Maps
              </button>

              {/* Date Range Selector */}
              <div className="mt-6 pt-6 border-t-2 border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 text-base">📅 Date Range Filter</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-2 uppercase">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-2 uppercase">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>
                  <button
                    onClick={handleApplyDateRange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-bold text-sm transition shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105 active:scale-95"
                  >
                    {loading ? '⏳ Loading...' : '✓ Apply Filter'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Analysis Tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-white rounded-2xl shadow-lg p-3 sticky top-0 z-10 flex-wrap border border-slate-100">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('scatter')}
                className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                  activeTab === 'scatter'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📈 NDVI vs NBR
              </button>
              <button
                onClick={() => setActiveTab('radar')}
                className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                  activeTab === 'radar'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🎯 Spectral Signature
              </button>
              <button
                onClick={() => setActiveTab('heatmap')}
                className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                  activeTab === 'heatmap'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🌿 NDVI Heatmap
              </button>
              <button
                onClick={() => setActiveTab('distribution')}
                className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                  activeTab === 'distribution'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📦 Distribution
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Dashboard Tab */}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-slate-100">
                  <div className="border-b-2 border-emerald-500 pb-4">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">📊 Mine Summary Dashboard</h2>
                    <p className="text-slate-600 text-sm">Key Performance Indicators and metrics for this mine</p>
                  </div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
                      ⚠️ Error: {error}
                    </div>
                  ) : (
                    <>
                      {/* KPI Data */}
                      {kpiData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 shadow-md">
                            <p className="text-orange-700 text-sm font-bold uppercase">Total Pixels</p>
                            <p className="text-4xl font-black text-orange-700 mt-2">{kpiData.total_pixels || 0}</p>
                          </div>
                          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 shadow-md">
                            <p className="text-red-700 text-sm font-bold uppercase">Excavated Pixels</p>
                            <p className="text-4xl font-black text-red-700 mt-2">{kpiData.excavated_pixels || 0}</p>
                          </div>
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border-2 border-emerald-200 shadow-md">
                            <p className="text-emerald-700 text-sm font-bold uppercase">Excavation %</p>
                            <p className="text-4xl font-black text-emerald-700 mt-2">
                              {kpiData.total_pixels > 0 
                                ? ((kpiData.excavated_pixels / kpiData.total_pixels) * 100).toFixed(1)
                                : 0}%
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Mine Data Dashboard */}
                      {mineData.length > 0 ? (
                        <MineSummaryDashboard mineData={mineData} />
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-600">No data available for selected date range</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* NDVI vs NBR Tab */}
              {activeTab === 'scatter' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-slate-100">
                  <div className="border-b-2 border-emerald-500 pb-4">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">📈 Spectral Analysis</h2>
                    <p className="text-slate-600 text-sm">NDVI vs NBR Analysis showing disturbed and undisturbed land areas</p>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
                      ⚠️ Error: {error}
                    </div>
                  ) : mineData.length > 0 ? (
                    <>
                      {/* Scatter Plot */}
                      <NDVIvsNBRScatterPlot mineData={mineData} />

                      {/* Analysis Legend */}
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-400 mt-1 shrink-0"></div>
                            <div>
                              <h3 className="font-bold text-red-900">Disturbed Land</h3>
                              <p className="text-sm text-red-700">Areas showing anomalies (Mining activity, excavation, disturbance)</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-400 mt-1 shrink-0"></div>
                            <div>
                              <h3 className="font-bold text-emerald-900">Undisturbed Land</h3>
                              <p className="text-sm text-emerald-700">Areas showing normal vegetation and no mining activity</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Info */}
                      <div className="bg-cyan-50 p-6 rounded-xl border-2 border-cyan-200">
                        <h3 className="font-bold text-cyan-900 mb-3 text-lg">📈 What You're Looking At</h3>
                        <div className="space-y-2 text-sm text-cyan-800">
                          <p><strong>X-Axis (NDVI):</strong> Normalized Difference Vegetation Index - measures vegetation health. Higher values indicate more vegetation.</p>
                          <p><strong>Y-Axis (NBR):</strong> Normalized Burn Ratio - measures burn severity and changes. Used to detect mining disturbance.</p>
                          <p><strong>Point Size:</strong> Represents the confidence score of the anomaly detection. Larger points indicate higher confidence.</p>
                          <p><strong>Colors:</strong> Red points indicate disturbed areas (likely mining activity). Green points show undisturbed natural areas.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No data available for selected date range</p>
                    </div>
                  )}
                </div>
              )}

              {/* Spectral Signature Tab */}
              {activeTab === 'radar' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-slate-100">
                  <div className="border-b-2 border-emerald-500 pb-4">
                    <h2 className="text-3xl font-black text-slate-800 mb-2">🎯 Spectral Signature Radar Chart</h2>
                    <p className="text-slate-600 text-sm">Comparison of spectral fingerprints between normal and anomalous pixels</p>
                  </div>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
                      ⚠️ Error: {error}
                    </div>
                  ) : mineData.length > 0 ? (
                    <SpectralSignatureRadarChart mineData={mineData} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No data available for selected date range</p>
                    </div>
                  )}
                </div>
              )}

              {/* NDVI Heatmap Tab */}
              {activeTab === 'heatmap' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-slate-100">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
                      ⚠️ Error: {error}
                    </div>
                  ) : mineData.length > 0 ? (
                    <NDVIHeatmap mineData={mineData} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No data available for selected date range</p>
                    </div>
                  )}
                </div>
              )}

              {/* Distribution Tab */}
              {activeTab === 'distribution' && (
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-slate-100">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                      <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-semibold">
                      ⚠️ Error: {error}
                    </div>
                  ) : mineData.length > 0 ? (
                    <ExcavationVsNormalDistribution mineData={mineData} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No data available for selected date range</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
