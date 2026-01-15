import React from 'react';

const Header = ({ totalMines, onAdminClick }) => {
  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white p-6 shadow-2xl z-30 border-b-4 border-emerald-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">⛏️ Adaptive Mining Monitor</h1>
          <p className="text-slate-300 text-sm">
            Advanced satellite monitoring for {totalMines || 0} mining sites across India
          </p>
        </div>
        <button
          onClick={onAdminClick}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          🔧 Admin Panel
        </button>
      </div>
    </header>
  );
};

export default Header;
