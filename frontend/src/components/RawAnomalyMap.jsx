import React, { useMemo } from 'react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const RawAnomalyMap = ({ mineData = [] }) => {
  const mapData = useMemo(() => {
    console.log('🗺️ RawAnomalyMap received mineData:', {
      total: mineData.length,
      sample: mineData.slice(0, 3),
      hasLongitude: mineData.length > 0 && 'longitude' in mineData[0],
      hasLatitude: mineData.length > 0 && 'latitude' in mineData[0],
    });
    
    if (!mineData || mineData.length === 0) return [];
    
    return mineData.map(pixel => ({
      longitude: pixel.longitude || 0,
      latitude: pixel.latitude || 0,
      anomaly_label: pixel.anomaly_label || -1,
      anomaly_score: pixel.anomaly_score || 0,
      name: `(${pixel.longitude?.toFixed(4)}, ${pixel.latitude?.toFixed(4)})`
    }));
  }, [mineData]);

  // Separate normal and anomalous pixels
  const anomalousPixels = mapData.filter(p => p.anomaly_label === 1);
  const normalPixels = mapData.filter(p => p.anomaly_label === -1);

  // Calculate axis ranges to fit the data
  const lons = mapData.map(p => p.longitude);
  const lats = mapData.map(p => p.latitude);
  const lonMin = Math.min(...lons);
  const lonMax = Math.max(...lons);
  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  
  // Add 5% padding to axis ranges
  const lonPadding = (lonMax - lonMin) * 0.1 || 1;
  const latPadding = (latMax - latMin) * 0.1 || 1;

  if (mapData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No anomaly data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-purple-500 pb-4">
        <h3 className="text-2xl font-black text-slate-800 mb-2">🗺️ Raw Anomaly Map</h3>
        <p className="text-slate-600 text-sm">Spatial distribution of raw spectral anomalies detected across all mine pixels</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
          <p className="text-purple-700 text-sm font-bold uppercase">Total Pixels</p>
          <p className="text-3xl font-black text-purple-700 mt-2">{mapData.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200">
          <p className="text-red-700 text-sm font-bold uppercase">Anomalous</p>
          <p className="text-3xl font-black text-red-700 mt-2">{anomalousPixels.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
          <p className="text-green-700 text-sm font-bold uppercase">Normal</p>
          <p className="text-3xl font-black text-green-700 mt-2">{normalPixels.length}</p>
        </div>
      </div>

      {/* Scatter Plot - Spatial Distribution */}
      <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">Spatial Distribution (Longitude vs Latitude)</h4>
        <div style={{ width: '100%', height: '500px' }}>
          <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            data={mapData}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="longitude" 
              label={{ value: 'Longitude', position: 'insideBottomRight', offset: -10 }}
              type="number"
              domain={[lonMin - lonPadding, lonMax + lonPadding]}
            />
            <YAxis 
              dataKey="latitude" 
              label={{ value: 'Latitude', angle: -90, position: 'insideLeft' }}
              type="number"
              domain={[latMin - latPadding, latMax + latPadding]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px'
              }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend />
            {anomalousPixels.length > 0 && (
              <Scatter
                name="Anomalous (-1)"
                data={anomalousPixels}
                fill="#ef4444"
                fillOpacity={0.7}
              />
            )}
            {normalPixels.length > 0 && (
              <Scatter
                name="Normal (1)"
                data={normalPixels}
                fill="#10b981"
                fillOpacity={0.6}
              />
            )}
          </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
        <h4 className="font-bold text-purple-900 mb-3">📊 About This Map</h4>
        <div className="space-y-2 text-sm text-purple-800">
          <p><strong>Red Points (Anomalous):</strong> Pixels identified as having spectral anomalies by the Isolation Forest model. These indicate potential mining disturbance.</p>
          <p><strong>Green Points (Normal):</strong> Pixels with normal spectral signatures, indicating undisturbed vegetation/land.</p>
          <p><strong>What it shows:</strong> The spatial distribution of all raw anomalies detected, combining all dates. This provides a complete picture of where model detected changes occur.</p>
          <p><strong>Next step:</strong> Temporal filtering (2+ consecutive time steps) produces the confirmed "Final Excavation Map".</p>
        </div>
      </div>
    </div>
  );
};

export default RawAnomalyMap;
