import React, { useMemo, useState } from 'react';

export function NDVIHeatmap({ mineData }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const GRID_SIZE = 20; // 20x20 grid

  const gridData = useMemo(() => {
    if (!mineData || mineData.length === 0) return null;

    // Get bounds
    const lats = mineData.map(p => p.latitude);
    const lons = mineData.map(p => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    // Create grid
    const grid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null).map(() => ({ pixels: [], ndvi: null })));

    // Populate grid
    mineData.forEach(pixel => {
      const colIdx = Math.floor(((pixel.longitude - minLon) / (maxLon - minLon)) * (GRID_SIZE - 0.001));
      const rowIdx = Math.floor(((pixel.latitude - minLat) / (maxLat - minLat)) * (GRID_SIZE - 0.001));
      
      if (colIdx >= 0 && colIdx < GRID_SIZE && rowIdx >= 0 && rowIdx < GRID_SIZE) {
        grid[rowIdx][colIdx].pixels.push(pixel);
      }
    });

    // Calculate mean NDVI for each cell
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.pixels.length > 0) {
          const sum = cell.pixels.reduce((acc, p) => acc + (p.ndvi || 0), 0);
          cell.ndvi = sum / cell.pixels.length;
        }
      });
    });

    // Calculate statistics
    const filledCells = grid.flat().filter(c => c.ndvi !== null);
    const ndviValues = filledCells.map(c => c.ndvi);
    
    const stats = {
      minNdvi: Math.min(...ndviValues),
      maxNdvi: Math.max(...ndviValues),
      meanNdvi: ndviValues.reduce((a, b) => a + b, 0) / ndviValues.length,
      filledCells: filledCells.length,
      totalCells: GRID_SIZE * GRID_SIZE,
      coverage: ((filledCells.length / (GRID_SIZE * GRID_SIZE)) * 100).toFixed(1)
    };

    return { grid, bounds: { minLat, maxLat, minLon, maxLon }, stats };
  }, [mineData]);

  // Color mapping function
  const ndviToColor = (ndvi) => {
    if (ndvi === null) return '#ffffff';
    if (ndvi < 0.1) return '#8B0000'; // Dark red - Bare
    if (ndvi < 0.3) return '#FF6B35'; // Orange - Low
    if (ndvi < 0.5) return '#FFE66D'; // Yellow - Moderate
    if (ndvi < 0.7) return '#87CEEB'; // Light blue - Healthy
    return '#228B22'; // Dark green - Very healthy
  };

  const getCellLabel = (ndvi) => {
    if (ndvi === null) return 'Empty';
    if (ndvi < 0.1) return 'Bare';
    if (ndvi < 0.3) return 'Low';
    if (ndvi < 0.5) return 'Mod';
    if (ndvi < 0.7) return 'Hlthy';
    return 'Very';
  };

  if (!gridData) {
    return <div className="text-center py-12 text-gray-500">No data available</div>;
  }

  const { grid, bounds, stats } = gridData;
  const cellSize = 30; // pixels per cell

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🌿 Grid-Based NDVI Heatmap - Cell Analysis</h3>
        <p className="text-gray-600 text-sm">
          Small cell grid showing actual NDVI coloring where data exists. Empty cells are transparent/white.
        </p>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#8B0000' }}></div>
            <span className="text-sm font-medium">&lt;0.1 (Bare)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#FF6B35' }}></div>
            <span className="text-sm font-medium">0.1-0.3 (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#FFE66D' }}></div>
            <span className="text-sm font-medium">0.3-0.5 (Mod)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#87CEEB' }}></div>
            <span className="text-sm font-medium">0.5-0.7 (Healthy)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: '#228B22' }}></div>
            <span className="text-sm font-medium">&gt;0.7 (Very)</span>
          </div>
        </div>
      </div>

      {/* Grid Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-sm font-medium">
          📍 Grid Resolution: {GRID_SIZE}×{GRID_SIZE} cells | Center: Lat {bounds.minLat.toFixed(4)}, Lon {bounds.minLon.toFixed(4)}
        </p>
      </div>

      {/* Grid Container */}
      <div className="flex gap-8">
        {/* Grid */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-x-auto">
          <div style={{ display: 'inline-block' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
              gap: '1px',
              backgroundColor: '#e5e7eb',
              padding: '4px',
              borderRadius: '4px'
            }}>
              {grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: ndviToColor(cell.ndvi),
                      border: hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx ? '2px solid #000' : '1px solid #ddd',
                      cursor: cell.ndvi !== null ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: cell.ndvi !== null && (cell.ndvi < 0.3 || cell.ndvi > 0.7) ? '#fff' : '#333',
                      userSelect: 'none'
                    }}
                    onMouseEnter={() => cell.ndvi !== null && setHoveredCell({ row: rowIdx, col: colIdx, ...cell })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={cell.ndvi ? `NDVI: ${cell.ndvi.toFixed(3)}, Pixels: ${cell.pixels.length}` : 'Empty'}
                  >
                    {cell.ndvi !== null && cell.ndvi.toFixed(2).substring(0, 4)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="w-64 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-bold text-gray-800 mb-4">📊 Grid Stats</h4>
            
            <div className="space-y-4">
              {/* Coverage */}
              <div className="border-b pb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Coverage</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-blue-600">{stats.coverage}%</p>
                  <p className="text-xs text-gray-600">Filled</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.filledCells} / {stats.totalCells} cells
                </p>
              </div>

              {/* NDVI Range */}
              <div className="border-b pb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">NDVI Range</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min:</span>
                    <span className="font-mono font-semibold text-red-600">
                      {stats.minNdvi.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-mono font-semibold text-green-600">
                      {stats.maxNdvi.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mean:</span>
                    <span className="font-mono font-semibold text-blue-600">
                      {stats.meanNdvi.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cell Resolution */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Cell Resolution</p>
                <p className="text-sm text-gray-600">Grid: {GRID_SIZE} × {GRID_SIZE}</p>
                <p className="text-sm text-gray-600">Cell Size: {cellSize}px</p>
              </div>
            </div>
          </div>

          {/* Hover Info */}
          {hoveredCell && (
            <div className="bg-blue-50 rounded-lg border-2 border-blue-400 p-4 animate-pulse">
              <p className="text-xs font-semibold text-blue-700 mb-2">✨ Hover Info</p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Cell:</span> ({hoveredCell.row}, {hoveredCell.col})
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">NDVI:</span> {hoveredCell.ndvi?.toFixed(3)}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Pixels:</span> {hoveredCell.pixels?.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 flex items-start gap-2">
          <span>💡</span>
          <span>Hover over cells to see NDVI values and coordinates. Dark red cells indicate mining excavation, while green cells show healthy vegetation.</span>
        </p>
      </div>
    </div>
  );
}

