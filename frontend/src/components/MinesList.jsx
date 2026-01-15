import React from 'react';
import MineCard from './MineCard';

const MinesList = ({ mines, selectedMine, onMineSelect, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Mines ({mines.length})</h2>
        <p className="text-sm text-gray-500">Click on a mine to view it on the map</p>
      </div>

      {/* Mines List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading mines...</p>
          </div>
        ) : mines.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">No mines found</p>
          </div>
        ) : (
          mines.map((mine) => (
            <MineCard
              key={mine.properties.mine_id}
              mine={mine}
              isSelected={selectedMine && selectedMine.properties.mine_id === mine.properties.mine_id}
              onSelect={onMineSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MinesList;
