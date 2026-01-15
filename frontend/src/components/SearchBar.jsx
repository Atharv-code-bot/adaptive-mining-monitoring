import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, selectedState, onStateChange, states }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Mines</label>
        <input
          type="text"
          placeholder="Search by name, ID, state, or district..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
        <p className="text-xs text-gray-500 mt-1">💡 Search by mine name, ID, state, or district</p>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by State</label>
        <select
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchBar;
