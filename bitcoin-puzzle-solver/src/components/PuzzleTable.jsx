import { useState, useMemo } from 'react';
import { decimalToHex, privateKeyToWIF } from '../utils/crypto';

export default function PuzzleTable({ puzzles, onSelectPuzzle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredAndSorted = useMemo(() => {
    let filtered = puzzles.filter(puzzle => {
      const matchesSearch = 
        puzzle.number.toString().includes(searchTerm) ||
        puzzle.status.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'solved' && puzzle.isSolved) ||
        (statusFilter === 'unsolved' && !puzzle.isSolved) ||
        (statusFilter === 'priority' && puzzle.priority === 'high');
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [puzzles, searchTerm, statusFilter, sortField, sortOrder]);

  const paginatedPuzzles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'SOLVED') return 'text-green-500';
    if (status === 'PRIORITY TARGET') return 'text-bitcoin-orange';
    return 'text-red-500';
  };

  const getStatusBg = (status) => {
    if (status === 'SOLVED') return 'bg-green-500/10';
    if (status === 'PRIORITY TARGET') return 'bg-bitcoin-orange/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search puzzles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-bitcoin-gray border border-bitcoin-orange/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-bitcoin-orange"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-bitcoin-gray border border-bitcoin-orange/30 rounded-lg text-white focus:outline-none focus:border-bitcoin-orange"
        >
          <option value="all">All Status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
          <option value="priority">Priority Targets</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm">
          <thead className="bg-bitcoin-gray border-b border-bitcoin-orange/30">
            <tr>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-bitcoin-orange"
                onClick={() => handleSort('number')}
              >
                Puzzle # {sortField === 'number' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-bitcoin-orange"
                onClick={() => handleSort('bitLength')}
              >
                Bits {sortField === 'bitLength' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-bitcoin-orange"
                onClick={() => handleSort('status')}
              >
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:text-bitcoin-orange"
                onClick={() => handleSort('prizeAmount')}
              >
                Prize (BTC) {sortField === 'prizeAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3">Exposed PubKey</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPuzzles.map((puzzle) => (
              <tr 
                key={puzzle.id}
                className="border-b border-bitcoin-gray hover:bg-bitcoin-gray/50 transition-colors"
              >
                <td className="px-4 py-3 font-mono font-bold text-bitcoin-orange">
                  #{puzzle.number}
                </td>
                <td className="px-4 py-3 font-mono">{puzzle.bitLength}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBg(puzzle.status)} ${getStatusColor(puzzle.status)}`}>
                    {puzzle.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{puzzle.prizeAmount.toFixed(1)}</td>
                <td className="px-4 py-3">
                  {puzzle.hasExposedPubKey ? (
                    <span className="text-green-500">✓ Yes</span>
                  ) : (
                    <span className="text-gray-500">✗ No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="px-2 py-1 bg-bitcoin-orange/20 text-bitcoin-orange rounded">
                    {puzzle.recommendedMethod}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectPuzzle(puzzle)}
                    className="px-3 py-1 bg-bitcoin-orange hover:bg-bitcoin-orange/80 text-black font-semibold rounded transition-colors text-xs"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} puzzles
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-bitcoin-gray hover:bg-bitcoin-orange/20 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-bitcoin-gray rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-bitcoin-gray hover:bg-bitcoin-orange/20 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
