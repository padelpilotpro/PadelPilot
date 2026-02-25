import { useState } from 'react';
import { UserPlus, UserMinus, Users, Check, X } from 'lucide-react';
import { Player } from '../types';

interface PlayerManagerProps {
  players: Record<string, Player>;
  onUpdatePlayers: (players: Record<string, Player>) => void;
  disabled: boolean;
  courts: number;
}

export const PlayerManager = ({ players, onUpdatePlayers, disabled, courts }: PlayerManagerProps) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const presentPlayers = Object.values(players).filter(p => p.present);
  const maxPlayers = courts * 4;

  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (!name) return;

    const exists = Object.values(players).some(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert('Player already exists!');
      return;
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      present: true
    };

    onUpdatePlayers({ ...players, [newPlayer.id]: newPlayer });
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    const { [id]: removed, ...rest } = players;
    onUpdatePlayers(rest);
  };

  const togglePresence = (id: string) => {
    onUpdatePlayers({
      ...players,
      [id]: { ...players[id], present: !players[id].present }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Players
        </h2>
        <span className="text-sm text-gray-500">
          {presentPlayers.length} / {maxPlayers} present
        </span>
      </div>

      {!disabled && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Add player name..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
            disabled={disabled}
          />
          <button
            onClick={addPlayer}
            disabled={disabled || !newPlayerName.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-colors"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {Object.values(players).map(player => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
              player.present ? 'bg-emerald-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => !disabled && togglePresence(player.id)}
                disabled={disabled}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  player.present
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {player.present ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
              <span className={`font-medium ${player.present ? 'text-gray-900' : 'text-gray-400'}`}>
                {player.name}
              </span>
            </div>
            {!disabled && (
              <button
                onClick={() => removePlayer(player.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {presentPlayers.length < 4 && (
        <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
          Need at least 4 players to start a match
        </p>
      )}
    </div>
  );
};