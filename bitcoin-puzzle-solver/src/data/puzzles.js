import { KNOWN_KEYS, getPredictionWithConfidence, getSearchRange } from '../utils/predictions';

/**
 * Generate complete puzzle data for all 160 puzzles
 */
export function generatePuzzleData() {
  const puzzles = [];
  
  // Puzzles with exposed public keys (multiples of 5)
  const exposedPubKeyPuzzles = new Set([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160]);
  
  for (let i = 1; i <= 160; i++) {
    const isSolved = i <= 70;
    const hasExposedPubKey = exposedPubKeyPuzzles.has(i);
    const prizeAmount = (i * 0.1).toFixed(1);
    const searchRange = getSearchRange(i);
    
    let privateKey = null;
    let prediction = null;
    
    if (isSolved) {
      privateKey = KNOWN_KEYS[i];
    } else {
      prediction = getPredictionWithConfidence(i);
    }
    
    // Determine priority status
    let status = isSolved ? 'SOLVED' : 'UNSOLVED';
    let priority = 'normal';
    
    // Priority targets: unsolved with exposed public keys
    if (!isSolved && hasExposedPubKey) {
      status = 'PRIORITY TARGET';
      priority = 'high';
    }
    
    puzzles.push({
      id: i,
      number: i,
      bitLength: i,
      status,
      priority,
      isSolved,
      hasExposedPubKey,
      prizeAmount: parseFloat(prizeAmount),
      privateKey,
      prediction,
      searchRange,
      recommendedMethod: hasExposedPubKey ? 'BSGS/Kangaroo' : 'GPU Brute Force',
      difficulty: calculateDifficulty(i)
    });
  }
  
  return puzzles;
}

/**
 * Calculate difficulty rating
 */
function calculateDifficulty(bitLength) {
  if (bitLength <= 40) return 'Very Easy';
  if (bitLength <= 50) return 'Easy';
  if (bitLength <= 60) return 'Medium';
  if (bitLength <= 70) return 'Hard';
  if (bitLength <= 80) return 'Very Hard';
  if (bitLength <= 100) return 'Extreme';
  return 'Nearly Impossible';
}

/**
 * Get puzzle statistics
 */
export function getPuzzleStats(puzzles) {
  const solved = puzzles.filter(p => p.isSolved).length;
  const unsolved = puzzles.filter(p => !p.isSolved).length;
  const priority = puzzles.filter(p => p.priority === 'high').length;
  const totalPrize = puzzles.reduce((sum, p) => sum + p.prizeAmount, 0);
  const remainingPrize = puzzles
    .filter(p => !p.isSolved)
    .reduce((sum, p) => sum + p.prizeAmount, 0);
  
  return {
    total: puzzles.length,
    solved,
    unsolved,
    priority,
    totalPrize: totalPrize.toFixed(1),
    remainingPrize: remainingPrize.toFixed(1),
    solvedPercentage: ((solved / puzzles.length) * 100).toFixed(1)
  };
}

/**
 * Filter puzzles based on criteria
 */
export function filterPuzzles(puzzles, filters) {
  let filtered = [...puzzles];
  
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'solved') {
      filtered = filtered.filter(p => p.isSolved);
    } else if (filters.status === 'unsolved') {
      filtered = filtered.filter(p => !p.isSolved);
    } else if (filters.status === 'priority') {
      filtered = filtered.filter(p => p.priority === 'high');
    }
  }
  
  if (filters.hasExposedPubKey !== undefined) {
    filtered = filtered.filter(p => p.hasExposedPubKey === filters.hasExposedPubKey);
  }
  
  if (filters.minBitLength) {
    filtered = filtered.filter(p => p.bitLength >= filters.minBitLength);
  }
  
  if (filters.maxBitLength) {
    filtered = filtered.filter(p => p.bitLength <= filters.maxBitLength);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.number.toString().includes(searchLower) ||
      p.status.toLowerCase().includes(searchLower) ||
      p.recommendedMethod.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
}

/**
 * Sort puzzles
 */
export function sortPuzzles(puzzles, sortBy, sortOrder = 'asc') {
  const sorted = [...puzzles];
  
  sorted.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}
