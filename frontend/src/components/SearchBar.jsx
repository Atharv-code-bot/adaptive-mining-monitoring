import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, selectedState, onStateChange, states }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-slate-100">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">🔍 Search Mines</label>
        <input
          type="text"
          placeholder="Search by name, ID, state..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
        />
        <p className="text-xs text-slate-500 mt-2">💡 Find any mine by name, ID, state, or district</p>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">📍 Filter by State</label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || selectedState) && (
        <button
          onClick={() => {
            onSearchChange('');
            onStateChange('');
          }}
          className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition font-medium text-sm"
        >
          ✕ Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchBar;
