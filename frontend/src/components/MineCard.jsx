import React from 'react';

const MineCard = ({ mine, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(mine);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-lg ${
        isSelected
          ? 'bg-blue-50 border-blue-500 shadow-md'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <h3 className="font-semibold text-gray-800 mb-2 truncate">
        {mine.properties.display_name}
      </h3>
      <div className="space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-medium">State:</span> {mine.properties.state}
        </p>
        <p>
          <span className="font-medium">District:</span> {mine.properties.district}
        </p>
        <p>
          <span className="font-medium">Sub-district:</span> {mine.properties.subdistrict}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          <span className="font-medium">Coordinates:</span> {mine.geometry.coordinates[1].toFixed(4)},
          {mine.geometry.coordinates[0].toFixed(4)}
        </p>
      </div>
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Selected
          </span>
        </div>
      )}
    </div>
  );
};

export default MineCard;
