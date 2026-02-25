import { useState } from 'react';
import { Trophy, MapPin, Clock, Plus } from 'lucide-react';
import { TournamentSettings } from '../types';

interface TournamentFormProps {
  onCreate: (settings: TournamentSettings) => void;
}

export const TournamentForm = ({ onCreate }: TournamentFormProps) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [courts, setCourts] = useState(2);
  const [format, setFormat] = useState<'americano' | 'classic'>('americano');
  const [pointsToWin, setPointsToWin] = useState(11);
  const [winBy, setWinBy] = useState(2);
  const [goldenPoint, setGoldenPoint] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onCreate({
      name: name.trim(),
      location: location.trim() || undefined,
      time: time.trim() || undefined,
      courts,
      format,
      pointsToWin,
      winBy,
      goldenPoint
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Padel Americano</h1>
          <p className="text-gray-600">Create your tournament in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weekend Padel Championship"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Padel Club Central"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Courts: {courts}
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={courts}
              onChange={(e) => setCourts(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'americano' | 'classic')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors bg-white"
              >
                <option value="americano">Americano (random pairs)</option>
                <option value="classic">Classic (fixed teams)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Points to Win</label>
              <select
                value={pointsToWin}
                onChange={(e) => setPointsToWin(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors bg-white"
              >
                <option value={6}>6 Points</option>
                <option value={9}>9 Points</option>
                <option value={11}>11 Points</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-700">Win By Margin</p>
              <p className="text-sm text-gray-500">Minimum point difference to win</p>
            </div>
            <select
              value={winBy}
              onChange={(e) => setWinBy(Number(e.target.value))}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors bg-white"
            >
              <option value={1}>1 Point</option>
              <option value={2}>2 Points</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-700">Golden Point</p>
              <p className="text-sm text-gray-500">Deciding point at deuce</p>
            </div>
            <button
              type="button"
              onClick={() => setGoldenPoint(!goldenPoint)}
              className={`relative w-14 h-8 rounded-full transition-colors ${goldenPoint ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${goldenPoint ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Tournament
          </button>
        </form>
      </div>
    </div>
  );
};