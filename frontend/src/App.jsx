import { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import MapComponent from './components/MapComponent';
import MineDetailsPanel from './components/MineDetailsPanel';
import AnalysisPage from './components/AnalysisPage';
import { AdminPage } from './components/AdminPage';
import SearchBar from './components/SearchBar';
import MinesList from './components/MinesList';
import { getMinesData } from './utils/dataLoader';

function App() {
  const [allMines, setAllMines] = useState([]);
  const [selectedMine, setSelectedMine] = useState(null);
  const [analyzingMine, setAnalyzingMine] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Load mines data on mount
  useEffect(() => {
    try {
      const minesData = getMinesData();
      setAllMines(minesData.features);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading mines data:', error);
      setIsLoading(false);
    }
  }, []);

  // Filter mines based on search term and state
  const filteredMines = useMemo(() => {
    return allMines.filter((mine) => {
      const { display_name, mine_id, state, district } = mine.properties;
      const searchLower = searchTerm.toLowerCase();

      // Search by mine ID, name, state, or district
      const matchesSearch =
        searchTerm === '' ||
        mine_id.toString().includes(searchTerm) ||
        display_name.toLowerCase().includes(searchLower) ||
        state.toLowerCase().includes(searchLower) ||
        district.toLowerCase().includes(searchLower);

      // Filter by state
      const matchesState = selectedState === '' || state === selectedState;

      return matchesSearch && matchesState;
    });
  }, [allMines, searchTerm, selectedState]);

  // Get unique states for filter
  const states = useMemo(() => {
    return [...new Set(allMines.map((mine) => mine.properties.state))].sort();
  }, [allMines]);

  const handleMineSelect = (mine) => {
    setSelectedMine(mine);
  };

  const handleAnalysis = (mine) => {
    setAnalyzingMine(mine);
  };

  const handleBackFromAnalysis = () => {
    setAnalyzingMine(null);
  };

  // If analyzing a mine, show the analysis page
  if (analyzingMine) {
    return <AnalysisPage mine={analyzingMine} onBack={handleBackFromAnalysis} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header totalMines={allMines.length} onAdminClick={() => setShowAdmin(true)} />

      {/* Admin Modal */}
      {showAdmin && <AdminPage onClose={() => setShowAdmin(false)} />}

      {/* Main Content - Map Takes Full Width */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Search & List */}
        {showSidebar && (
          <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              states={states}
            />
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Found {filteredMines.length} mine{filteredMines.length !== 1 ? 's' : ''}
              </h3>
              <MinesList
                mines={filteredMines}
                selectedMine={selectedMine}
                onMineSelect={handleMineSelect}
              />
            </div>
          </div>
        )}

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 left-4 z-20 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2 font-medium"
        >
          {showSidebar ? '◀ Hide' : '▶ Search'}
        </button>

        {/* Full Screen Map */}
        <div className="flex-1">
          <MapComponent
            mines={filteredMines}
            selectedMine={selectedMine}
            onMineSelect={handleMineSelect}
            isLoading={isLoading}
          />
        </div>

        {/* Floating Details Panel */}
        {selectedMine && (
          <MineDetailsPanel
            mine={selectedMine}
            onClose={() => setSelectedMine(null)}
            onAnalysis={handleAnalysis}
          />
        )}
      </div>
    </div>
  );
}

export default App;
