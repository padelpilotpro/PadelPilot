import { Player, Match, Round, LeaderboardEntry, TournamentSettings } from '../types';

export const generateId = () => Math.random().toString(36).substring(2, 8);

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateRound = (players: Player[], courts: number, existingRounds: Round[]): Round => {
  const presentPlayers = players.filter(p => p.present);
  const shuffled = shuffleArray(presentPlayers.map(p => p.id));
  
  const matches: Match[] = [];
  const resting: string[] = [];
  
  const playersPerMatch = 4;
  const maxMatches = courts;
  
  for (let i = 0; i < shuffled.length; i += playersPerMatch) {
    if (matches.length >= maxMatches) {
      resting.push(...shuffled.slice(i));
      break;
    }
    
    const matchPlayers = shuffled.slice(i, i + playersPerMatch);
    if (matchPlayers.length === 4) {
      matches.push({
        id: generateId(),
        teamA: [matchPlayers[0], matchPlayers[1]],
        teamB: [matchPlayers[2], matchPlayers[3]],
        scoreA: 0,
        scoreB: 0,
        completed: false,
        court: matches.length + 1
      });
    } else {
      resting.push(...matchPlayers);
    }
  }
  
  return {
    id: generateId(),
    matches,
    resting,
    timestamp: Date.now()
  };
};

export const validateScore = (
  scoreA: number,
  scoreB: number,
  settings: TournamentSettings
): { valid: boolean; message?: string } => {
  const { pointsToWin, winBy, goldenPoint } = settings;
  
  if (scoreA < 0 || scoreB < 0) {
    return { valid: false, message: 'Scores cannot be negative' };
  }
  
  const maxScore = Math.max(scoreA, scoreB);
  const minScore = Math.min(scoreA, scoreB);
  
  if (maxScore < pointsToWin) {
    return { valid: false, message: `Winner must reach ${pointsToWin} points` };
  }
  
  if (maxScore === pointsToWin && minScore >= pointsToWin - winBy + 1) {
    return { valid: false, message: `Must win by ${winBy} points` };
  }
  
  if (goldenPoint && maxScore > pointsToWin && minScore === pointsToWin) {
    return { valid: false, message: 'Golden point: next point wins at deuce' };
  }
  
  return { valid: true };
};

export const calculateLeaderboard = (
  players: Record<string, Player>,
  rounds: Round[]
): LeaderboardEntry[] => {
  const stats: Record<string, LeaderboardEntry> = {};
  
  Object.entries(players).forEach(([id, player]) => {
    stats[id] = {
      playerId: id,
      playerName: player.name,
      wins: 0,
      matchesPlayed: 0,
      gamesFor: 0,
      gamesAgainst: 0,
      pointDiff: 0
    };
  });
  
  rounds.forEach(round => {
    round.matches.forEach(match => {
      if (!match.completed) return;
      
      const allPlayers = [...match.teamA, ...match.teamB];
      allPlayers.forEach(playerId => {
        if (stats[playerId]) {
          stats[playerId].matchesPlayed++;
        }
      });
      
      const teamAWon = match.scoreA > match.scoreB;
      const winningTeam = teamAWon ? match.teamA : match.teamB;
      const losingTeam = teamAWon ? match.teamB : match.teamA;
      
      winningTeam.forEach(playerId => {
        if (stats[playerId]) {
          stats[playerId].wins++;
          stats[playerId].gamesFor += teamAWon ? match.scoreA : match.scoreB;
          stats[playerId].gamesAgainst += teamAWon ? match.scoreB : match.scoreA;
        }
      });
      
      losingTeam.forEach(playerId => {
        if (stats[playerId]) {
          stats[playerId].gamesFor += teamAWon ? match.scoreB : match.scoreA;
          stats[playerId].gamesAgainst += teamAWon ? match.scoreA : match.scoreB;
        }
      });
    });
  });
  
  Object.values(stats).forEach(entry => {
    entry.pointDiff = entry.gamesFor - entry.gamesAgainst;
  });
  
  return Object.values(stats).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.pointDiff !== a.pointDiff) return b.pointDiff - a.pointDiff;
    return b.gamesFor - a.gamesFor;
  });
};

export const hasGameStarted = (rounds: Round[]): boolean => {
  return rounds.length > 0;
};