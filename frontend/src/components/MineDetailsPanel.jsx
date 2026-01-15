import React, { useState } from 'react';
import NDVIvsNBRScatter from './NDVIvsNBRScatter';

const MineDetailsPanel = ({ mine, onClose, onAnalysis }) => {
  const [activeTab, setActiveTab] = useState('info');

  if (!mine) return null;

  const { properties, geometry } = mine;
  const [lng, lat] = geometry.coordinates;

  return (
    <div className="absolute bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] bg-white rounded-lg shadow-2xl overflow-hidden z-10 animate-slideIn flex flex-col">
      {/* Header with close button */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 flex items-center justify-between shrink-0 gap-3">
        <h2 className="text-lg font-bold text-white truncate flex-1">{properties.display_name}</h2>
        <button
          onClick={() => onAnalysis(mine)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1 whitespace-nowrap"
          title="Open detailed analysis on full page"
        >
          📊 Analysis
        </button>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-800 rounded-full w-7 h-7 flex items-center justify-center transition flex-shrink-0"
          aria-label="Close details"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'info'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          📋 Mine Info
        </button>
        <button
          onClick={() => setActiveTab('spectral')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition ${
            activeTab === 'spectral'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 NDVI vs NBR
        </button>
      </div>

      {/* Details Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'info' ? (
          <div className="p-6 space-y-4 overflow-y-auto h-full custom-scrollbar">
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
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Latitude:</span>
              <span className="text-sm text-gray-900 font-mono">{lat.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Longitude:</span>
              <span className="text-sm text-gray-900 font-mono">{lng.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </div>
        ) : (
          <div className="p-4 h-full">
            <NDVIvsNBRScatter mineId={properties.mine_id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MineDetailsPanel;
