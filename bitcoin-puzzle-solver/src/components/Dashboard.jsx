import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ puzzles }) {
  const stats = useMemo(() => {
    const solved = puzzles.filter(p => p.isSolved).length;
    const unsolved = puzzles.filter(p => !p.isSolved).length;
    const priority = puzzles.filter(p => p.priority === 'high').length;
    const totalPrize = puzzles.reduce((sum, p) => sum + p.prizeAmount, 0);
    const remainingPrize = puzzles.filter(p => !p.isSolved).reduce((sum, p) => sum + p.prizeAmount, 0);
    const solvedPrize = totalPrize - remainingPrize;

    return {
      total: puzzles.length,
      solved,
      unsolved,
      priority,
      totalPrize: totalPrize.toFixed(1),
      remainingPrize: remainingPrize.toFixed(1),
      solvedPrize: solvedPrize.toFixed(1),
      solvedPercentage: ((solved / puzzles.length) * 100).toFixed(1)
    };
  }, [puzzles]);

  const difficultyData = useMemo(() => {
    const difficulties = {};
    puzzles.forEach(p => {
      if (!difficulties[p.difficulty]) {
        difficulties[p.difficulty] = { solved: 0, unsolved: 0 };
      }
      if (p.isSolved) {
        difficulties[p.difficulty].solved++;
      } else {
        difficulties[p.difficulty].unsolved++;
      }
    });

    return Object.entries(difficulties).map(([name, data]) => ({
      name,
      solved: data.solved,
      unsolved: data.unsolved
    }));
  }, [puzzles]);

  const statusData = [
    { name: 'Solved', value: stats.solved, color: '#10b981' },
    { name: 'Priority', value: stats.priority, color: '#f7931a' },
    { name: 'Unsolved', value: stats.unsolved - stats.priority, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-bitcoin-gray to-bitcoin-darker p-6 rounded-lg border border-bitcoin-orange/30">
          <div className="text-gray-400 text-sm mb-1">Total Puzzles</div>
          <div className="text-3xl font-bold text-bitcoin-orange">{stats.total}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 rounded-lg border border-green-500/30">
          <div className="text-gray-400 text-sm mb-1">Solved</div>
          <div className="text-3xl font-bold text-green-500">{stats.solved}</div>
          <div className="text-xs text-gray-400 mt-1">{stats.solvedPercentage}% complete</div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 p-6 rounded-lg border border-red-500/30">
          <div className="text-gray-400 text-sm mb-1">Unsolved</div>
          <div className="text-3xl font-bold text-red-500">{stats.unsolved}</div>
          <div className="text-xs text-gray-400 mt-1">{stats.priority} priority targets</div>
        </div>

        <div className="bg-gradient-to-br from-bitcoin-orange/10 to-bitcoin-orange/5 p-6 rounded-lg border border-bitcoin-orange/30">
          <div className="text-gray-400 text-sm mb-1">Remaining Prize</div>
          <div className="text-3xl font-bold text-bitcoin-orange">{stats.remainingPrize}</div>
          <div className="text-xs text-gray-400 mt-1">BTC</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-bitcoin-orange mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-bitcoin-orange mb-4">Difficulty Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #f7931a',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="solved" fill="#10b981" name="Solved" />
              <Bar dataKey="unsolved" fill="#ef4444" name="Unsolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prize Information */}
      <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-bitcoin-orange mb-4">Prize Pool Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bitcoin-gray p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Total Prize Pool</div>
            <div className="text-2xl font-bold text-bitcoin-orange">{stats.totalPrize} BTC</div>
          </div>
          <div className="bg-bitcoin-gray p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Claimed (Solved)</div>
            <div className="text-2xl font-bold text-green-500">{stats.solvedPrize} BTC</div>
          </div>
          <div className="bg-bitcoin-gray p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Remaining (Unsolved)</div>
            <div className="text-2xl font-bold text-red-500">{stats.remainingPrize} BTC</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-bitcoin-dark border border-bitcoin-orange/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-bitcoin-orange mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Easiest Unsolved</div>
            <div className="text-lg font-bold text-bitcoin-orange">
              #{puzzles.find(p => !p.isSolved)?.number || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Highest Prize Unsolved</div>
            <div className="text-lg font-bold text-bitcoin-orange">
              #{puzzles.filter(p => !p.isSolved).sort((a, b) => b.prizeAmount - a.prizeAmount)[0]?.number || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Priority Targets</div>
            <div className="text-lg font-bold text-bitcoin-orange">{stats.priority}</div>
          </div>
          <div>
            <div className="text-gray-400">With Exposed PubKey</div>
            <div className="text-lg font-bold text-bitcoin-orange">
              {puzzles.filter(p => p.hasExposedPubKey).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
