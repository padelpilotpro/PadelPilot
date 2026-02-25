export interface Player {
  id: string;
  name: string;
  present: boolean;
}

export interface Match {
  id: string;
  teamA: string[];
  teamB: string[];
  scoreA: number;
  scoreB: number;
  completed: boolean;
  court: number;
}

export interface Round {
  id: string;
  matches: Match[];
  resting: string[];
  timestamp: number;
}

export interface TournamentSettings {
  name: string;
  location?: string;
  time?: string;
  courts: number;
  format: 'americano' | 'classic';
  pointsToWin: number;
  winBy: number;
  goldenPoint: boolean;
}

export interface Tournament {
  id: string;
  settings: TournamentSettings;
  players: Record<string, Player>;
  rounds: Round[];
  createdAt: number;
  createdBy: string;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  wins: number;
  matchesPlayed: number;
  gamesFor: number;
  gamesAgainst: number;
  pointDiff: number;
}

export type Tab = 'arena' | 'leaderboard' | 'rules';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}