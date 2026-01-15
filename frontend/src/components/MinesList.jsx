import React from 'react';
import MineCard from './MineCard';

const MinesList = ({ mines, selectedMine, onMineSelect, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col border border-slate-100">
      {/* Header */}
      <div className="mb-4 border-b-2 border-emerald-500 pb-4">
        <h2 className="text-xl font-black text-slate-800">🏭 Mines ({mines.length})</h2>
        <p className="text-sm text-slate-600 mt-1">Click on a mine to view it on the map</p>
      </div>

      {/* Mines List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-600 font-medium">Loading mines...</p>
          </div>
        ) : mines.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-600 font-medium">No mines found</p>
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
