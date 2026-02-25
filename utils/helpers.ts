import { LeaderboardEntry } from '../types';

export const exportToCSV = (leaderboard: LeaderboardEntry[], tournamentName: string) => {
  const headers = ['Rank', 'Player', 'Wins', 'Matches', 'Games For', 'Games Against', 'Point Diff'];
  const rows = leaderboard.map((entry, index) => [
    index + 1,
    entry.playerName,
    entry.wins,
    entry.matchesPlayed,
    entry.gamesFor,
    entry.gamesAgainst,
    entry.pointDiff
  ]);
  
  const csvContent = [
    `Tournament: ${tournamentName}`,
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${tournamentName.replace(/\s+/g, '_')}_leaderboard.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isRTL = () => {
  return navigator.language.startsWith('ar');
};

export const getShareUrl = (tournamentId: string) => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/tournament/${tournamentId}`;
};

export const isSpectator = () => {
  return new URLSearchParams(window.location.search).has('view');
};