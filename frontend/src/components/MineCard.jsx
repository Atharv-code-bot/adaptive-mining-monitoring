import React from 'react';

const MineCard = ({ mine, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(mine);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-500 shadow-lg'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-800 mb-2 truncate flex-1">
          {mine.properties.display_name}
        </h3>
        {mine.properties.pinned && (
          <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-lg font-bold flex-shrink-0">
            📌
          </span>
        )}
      </div>
      <div className="space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-bold text-slate-800">State:</span> {mine.properties.state}
        </p>
        <p>
          <span className="font-bold text-slate-800">District:</span> {mine.properties.district}
        </p>
        <p>
          <span className="font-bold text-slate-800">Sub-district:</span> {mine.properties.subdistrict}
        </p>
        <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-2 py-1 rounded-lg">
          📍 {mine.geometry.coordinates[1].toFixed(4)}, {mine.geometry.coordinates[0].toFixed(4)}
        </p>
      </div>
      {isSelected && (
        <div className="mt-3 pt-3 border-t-2 border-emerald-300">
          <span className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs px-3 py-1 rounded-lg font-bold">
            ✓ Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default MineCard;
