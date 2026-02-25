import { useState } from 'react';
import { Shuffle, Coffee, Play } from 'lucide-react';
import { Round, Match, Player } from '../types';
import { MatchCard } from './MatchCard';
import { validateScore, generateRound } from '../utils/tournamentLogic';

interface RoundGeneratorProps {
  players: Record<string, Player>;
  rounds: Round[];
  settings: any;
  onAddRound: (round: Round) => void;
  onUpdateMatch: (roundId: string, matchId: string, match: Match) => void;
  disabled: boolean;
}

export const RoundGenerator = ({ players, rounds, settings, onAddRound, onUpdateMatch, disabled }: RoundGeneratorProps) => {
  const [showTimer, setShowTimer] = useState(false);
  const currentRound = rounds[rounds.length - 1];

  const handleGenerateRound = () => {
    const newRound = generateRound(Object.values(players), settings.courts, rounds);
    onAddRound(newRound);
  };

  const handleUpdateScore = (matchId: string, scoreA: number, scoreB: number) => {
    if (!currentRound) return;
    
    const updatedMatch = {
      ...currentRound.matches.find(m => m.id === matchId)!,
      scoreA,
      scoreB
    };
    
    onUpdateMatch(currentRound.id, matchId, updatedMatch);
  };

  const handleConfirmMatch = (matchId: string) => {
    if (!currentRound) return;
    
    const match = currentRound.matches.find(m => m.id === matchId)!;
    const validation = validateScore(match.scoreA, match.scoreB, settings);
    
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    
    const updatedMatch = {
      ...match,
      completed: true
    };
    
    onUpdateMatch(currentRound.id, matchId, updatedMatch);
  };

  const presentPlayers = Object.values(players).filter(p => p.present);
  const canGenerate = presentPlayers.length >= 4 && !disabled;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Arena</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTimer(!showTimer)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showTimer ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Timer
          </button>
          <span className="text-sm text-gray-500">Round {rounds.length}</span>
        </div>
      </div>

      {!currentRound && canGenerate && (
        <button
          onClick={handleGenerateRound}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Shuffle className="w-5 h-5" />
          Generate Round
        </button>
      )}

      {currentRound && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRound.matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              players={players}
              onUpdateScore={handleUpdateScore}
              onConfirm={handleConfirmMatch}
              disabled={disabled}
              showTimer={showTimer}
            />
          ))}
        </div>
      )}

      {currentRound && currentRound.resting.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Coffee className="w-5 h-5" />
            <span className="font-semibold">Resting this round</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentRound.resting.map(playerId => {
              const player = players[playerId];
              return player ? (
                <span key={playerId} className="bg-white px-3 py-1 rounded-full text-sm text-amber-800">
                  {player.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {currentRound && !disabled && currentRound.matches.every(m => m.completed) && (
        <button
          onClick={handleGenerateRound}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Next Round
        </button>
      )}
    </div>
  );
};