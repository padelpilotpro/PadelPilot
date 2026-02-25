import { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { Match, Player } from '../types';

interface MatchCardProps {
  match: Match;
  players: Record<string, Player>;
  onUpdateScore: (matchId: string, scoreA: number, scoreB: number) => void;
  onConfirm: (matchId: string) => void;
  disabled: boolean;
  showTimer?: boolean;
}

export const MatchCard = ({ match, players, onUpdateScore, onConfirm, disabled, showTimer }: MatchCardProps) => {
  const getPlayerName = (id: string) => players[id]?.name || 'Unknown';

  const teamAPlayers = match.teamA.map(getPlayerName);
  const teamBPlayers = match.teamB.map(getPlayerName);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-emerald-600 text-white px-4 py-2 flex items-center justify-between">
        <span className="font-semibold">Court {match.court}</span>
        {showTimer && !match.completed && (
          <span className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4" />
            <MatchTimer />
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-semibold text-gray-900">{teamAPlayers[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">{teamAPlayers[1]}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              value={match.scoreA}
              onChange={(e) => onUpdateScore(match.id, Number(e.target.value), match.scoreB)}
              disabled={disabled || match.completed}
              className={`w-16 h-16 text-center text-3xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                match.completed && match.scoreA > match.scoreB
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'border-gray-200 focus:border-emerald-500'
              }`}
            />
            <span className="text-2xl font-bold text-gray-400">-</span>
            <input
              type="number"
              min="0"
              value={match.scoreB}
              onChange={(e) => onUpdateScore(match.id, match.scoreA, Number(e.target.value))}
              disabled={disabled || match.completed}
              className={`w-16 h-16 text-center text-3xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                match.completed && match.scoreB > match.scoreA
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'border-gray-200 focus:border-emerald-500'
              }`}
            />
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="font-semibold text-gray-900">{teamBPlayers[0]}</span>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-gray-600">{teamBPlayers[1]}</span>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
          </div>
        </div>

        {!match.completed && !disabled && (
          <button
            onClick={() => onConfirm(match.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Confirm Result
          </button>
        )}

        {match.completed && (
          <div className="text-center text-green-600 font-semibold bg-green-50 py-2 rounded-xl">
            ✓ Match Completed
          </div>
        )}
      </div>
    </div>
  );
};

const MatchTimer = () => {
  const [seconds, setSeconds] = useState(180);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => (s > 0 ? s - 1 : 180));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <span className={seconds < 30 ? 'text-red-200' : ''}>
      {mins}:{secs.toString().padStart(2, '0')}
    </span>
  );
};