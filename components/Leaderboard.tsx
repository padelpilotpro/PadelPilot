import { Trophy, Medal, Award, Download } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { exportToCSV } from '../utils/helpers';

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  tournamentName: string;
}

export const Leaderboard = ({ leaderboard, tournamentName }: LeaderboardProps) => {
  const handleExport = () => {
    exportToCSV(leaderboard, tournamentName);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-400">{rank}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-medium text-gray-700"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-2 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span className="text-center">#</span>
          <span className="col-span-2">Player</span>
          <span className="text-center">W</span>
          <span className="text-center">M</span>
          <span className="text-center">+</span>
          <span className="text-center">-</span>
        </div>

        {leaderboard.map((entry, index) => (
          <div
            key={entry.playerId}
            className={`grid grid-cols-7 gap-2 px-4 py-4 border-t border-gray-100 items-center transition-colors ${
              index === 0 ? 'bg-yellow-50' : ''
            }`}
          >
            <span className="text-center">{getRankIcon(index + 1)}</span>
            <span className="col-span-2 font-semibold text-gray-900">{entry.playerName}</span>
            <span className="text-center font-bold text-emerald-600">{entry.wins}</span>
            <span className="text-center text-gray-500">{entry.matchesPlayed}</span>
            <span className="text-center text-green-600">{entry.gamesFor}</span>
            <span className="text-center text-red-500">{entry.gamesAgainst}</span>
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500">
            No matches completed yet
          </div>
        )}
      </div>
    </div>
  );
};