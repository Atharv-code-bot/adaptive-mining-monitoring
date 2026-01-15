import React from 'react';

const Header = ({ totalMines }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">⛏️ Mine Location Tracker</h1>
        <p className="text-blue-100">
          Explore and track mines across {totalMines || 0} locations in India
        </p>
      </div>
    </header>
  );
};

export default Header;
