import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PuzzleTable from './components/PuzzleTable';
import PuzzleDetails from './components/PuzzleDetails';
import KeyConverter from './components/KeyConverter';
import { generatePuzzleData } from './data/puzzles';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [puzzles, setPuzzles] = useState([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Generate puzzle data on mount
    const data = generatePuzzleData();
    setPuzzles(data);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'puzzles', label: 'Puzzle Inventory', icon: '🧩' },
    { id: 'converter', label: 'Key Converter', icon: '🔑' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="min-h-screen bg-bitcoin-darker text-white">
      {/* Header */}
      <header className="bg-bitcoin-dark border-b border-bitcoin-orange/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">₿</div>
              <div>
                <h1 className="text-2xl font-bold text-bitcoin-orange">Bitcoin Puzzle Solver</h1>
                <p className="text-sm text-gray-400">Advanced Key Discovery & Analysis Platform</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-bitcoin-gray hover:bg-bitcoin-orange/20 rounded-lg transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-bitcoin-dark border-b border-bitcoin-orange/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-bitcoin-orange text-black'
                    : 'text-gray-400 hover:text-white hover:bg-bitcoin-gray'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard puzzles={puzzles} />}
        
        {activeTab === 'puzzles' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-bitcoin-orange mb-2">Puzzle Inventory</h2>
              <p className="text-gray-400">
                Browse all 160 Bitcoin puzzles. Click on any puzzle to view detailed information.
              </p>
            </div>
            <PuzzleTable puzzles={puzzles} onSelectPuzzle={setSelectedPuzzle} />
          </div>
        )}
        
        {activeTab === 'converter' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-bitcoin-orange mb-2">Private Key Converter</h2>
              <p className="text-gray-400">
                Convert and validate private keys between different formats.
              </p>
            </div>
            <KeyConverter />
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="max-w-4xl">
            <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-bitcoin-orange mb-4">About Bitcoin Puzzle Solver</h2>
                <p className="text-gray-300 leading-relaxed">
                  This application is designed to help researchers and enthusiasts explore the famous Bitcoin puzzle challenge,
                  which consists of 160 puzzles with increasing difficulty levels. Each puzzle represents a Bitcoin private key
                  within a specific bit-length range.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-bitcoin-orange mb-3">Mathematical Prediction Models</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="bg-bitcoin-gray p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">1. Logarithmic Formula</h4>
                    <code className="text-sm text-bitcoin-orange">log₁₀(a[n]) = 0.2523×n + 0.6080</code>
                    <p className="text-sm mt-2">
                      This formula predicts private key values based on logarithmic growth patterns observed in solved puzzles.
                    </p>
                  </div>
                  
                  <div className="bg-bitcoin-gray p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">2. 3-Term Recurrence Relation</h4>
                    <code className="text-sm text-bitcoin-orange">a[n] = 2.2325×a[n-1] - 0.4035×a[n-2] - 0.8275×a[n-3]</code>
                    <p className="text-sm mt-2">
                      This recurrence relation uses the three previous solved keys to predict the next key value.
                      Generally provides more accurate predictions than the logarithmic formula.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-bitcoin-orange mb-3">Solving Methods</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="bg-bitcoin-gray p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">BSGS/Kangaroo (For Exposed Public Keys)</h4>
                    <p className="text-sm">
                      Baby-Step Giant-Step and Kangaroo algorithms are highly efficient for puzzles with exposed public keys.
                      These algorithms can significantly reduce search time compared to brute force.
                    </p>
                  </div>
                  
                  <div className="bg-bitcoin-gray p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">GPU Brute Force</h4>
                    <p className="text-sm">
                      For puzzles without exposed public keys, GPU-accelerated brute force is the primary method.
                      Modern GPUs can check millions of keys per second.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-bitcoin-orange mb-3">Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Complete inventory of all 160 Bitcoin puzzles</li>
                  <li>Mathematical predictions for unsolved puzzles</li>
                  <li>Private key format converter (Decimal, Hex, WIF, Binary)</li>
                  <li>Bitcoin address generation and validation</li>
                  <li>Search, filter, and sort functionality</li>
                  <li>Detailed puzzle information and statistics</li>
                  <li>Dark mode Bitcoin-themed interface</li>
                </ul>
              </div>

              <div className="border-t border-bitcoin-orange/30 pt-6">
                <h3 className="text-xl font-semibold text-bitcoin-orange mb-3">Disclaimer</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This tool is for educational and research purposes only. The mathematical predictions are based on
                  patterns in solved puzzles and should not be considered as guaranteed solutions. Always verify any
                  findings independently and use appropriate security measures when handling private keys.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-bitcoin-dark border-t border-bitcoin-orange/30 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Bitcoin Puzzle Solver © 2025 | Educational & Research Tool</p>
          <p className="mt-2">Built with React, Tailwind CSS, and bitcoinjs-lib</p>
        </div>
      </footer>

      {/* Puzzle Details Modal */}
      {selectedPuzzle && (
        <PuzzleDetails puzzle={selectedPuzzle} onClose={() => setSelectedPuzzle(null)} />
      )}
    </div>
  );
}

export default App;
