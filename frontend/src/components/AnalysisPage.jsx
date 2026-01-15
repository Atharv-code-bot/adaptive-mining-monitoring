import React, { useState } from 'react';
import NDVIvsNBRScatter from './NDVIvsNBRScatter';
import KPIDashboard from './KPIDashboard';
import SpectralRadarChart from './SpectralRadarChart';

const AnalysisPage = ({ mine, onBack }) => {
  const { properties, geometry } = mine;
  const [lng, lat] = geometry.coordinates;
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-blue-500 hover:bg-blue-800 px-4 py-2 rounded-lg transition font-medium text-sm flex items-center gap-2"
            >
              ← Back to Map
            </button>
            <div>
              <h1 className="text-2xl font-bold">{properties.display_name}</h1>
              <p className="text-blue-100 text-sm">Mine ID: {properties.mine_id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Mine Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4 sticky top-8">
              <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Mine Details</h2>

              {/* Mine ID */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Mine ID</p>
                <p className="text-lg font-semibold text-orange-600 mt-1">{properties.mine_id}</p>
              </div>

              {/* State */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">State</p>
                <p className="text-lg font-semibold text-blue-600 mt-1">{properties.state}</p>
              </div>

              {/* District */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">District</p>
                <p className="text-lg font-semibold text-green-600 mt-1">{properties.district}</p>
              </div>

              {/* Sub-district */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Sub-district</p>
                <p className="text-lg font-semibold text-purple-600 mt-1">{properties.subdistrict}</p>
              </div>

              {/* Coordinates */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-3">Coordinates</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-600">Latitude:</span>
                    <p className="text-sm text-gray-900 font-mono">{lat.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-600">Longitude:</span>
                    <p className="text-sm text-gray-900 font-mono">{lng.toFixed(6)}</p>
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
              >
                📍 View on Google Maps
              </button>
            </div>
          </div>

          {/* Right Content - Analysis Tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 bg-white rounded-lg shadow-md p-2 sticky top-0 z-10">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition text-sm ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('scatter')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition text-sm ${
                  activeTab === 'scatter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📈 NDVI vs NBR
              </button>
              <button
                onClick={() => setActiveTab('radar')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition text-sm ${
                  activeTab === 'radar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎯 Spectral Signature
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Dashboard Tab */}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Mine Summary Dashboard</h2>
                    <p className="text-gray-600 text-sm">Key Performance Indicators and metrics for this mine</p>
                  </div>
                  <KPIDashboard mineId={properties.mine_id} />
                </div>
              )}

              {/* NDVI vs NBR Tab */}
              {activeTab === 'scatter' && (
                <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Spectral Analysis</h2>
                    <p className="text-gray-600 text-sm">NDVI vs NBR Analysis showing disturbed and undisturbed land areas</p>
                  </div>

                  {/* Scatter Plot */}
                  <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden">
                    <NDVIvsNBRScatter mineId={properties.mine_id} />
                  </div>

                  {/* Analysis Legend */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-400 mt-1 shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-red-900">Disturbed Land</h3>
                          <p className="text-sm text-red-700">Areas showing anomalies (Mining activity, excavation, disturbance)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-400 mt-1 shrink-0"></div>
                        <div>
                          <h3 className="font-semibold text-green-900">Undisturbed Land</h3>
                          <p className="text-sm text-green-700">Areas showing normal vegetation and no mining activity</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Info */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3">📈 What You're Looking At</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>X-Axis (NDVI):</strong> Normalized Difference Vegetation Index - measures vegetation health. Higher values indicate more vegetation.</p>
                      <p><strong>Y-Axis (NBR):</strong> Normalized Burn Ratio - measures burn severity and changes. Used to detect mining disturbance.</p>
                      <p><strong>Point Size:</strong> Represents the confidence score of the anomaly detection. Larger points indicate higher confidence.</p>
                      <p><strong>Colors:</strong> Red points indicate disturbed areas (likely mining activity). Green points show undisturbed natural areas.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Spectral Signature Tab */}
              {activeTab === 'radar' && (
                <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">🎯 Spectral Signature Radar Chart</h2>
                    <p className="text-gray-600 text-sm">Comparison of spectral fingerprints between normal and anomalous pixels</p>
                  </div>
                  <SpectralRadarChart mineId={properties.mine_id} />
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
