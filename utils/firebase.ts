import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';
import { signInAnonymously, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDemo-Key-Replace-With-Your-Own",
  authDomain: "padel-americano.firebaseapp.com",
  databaseURL: "https://padel-americano-default-rtdb.firebaseio.com",
  projectId: "padel-americano",
  storageBucket: "padel-americano.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const auth = getAuth(app);

export const signIn = async () => {
  try {
    await signInAnonymously(auth);
    return auth.currentUser?.uid;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const createTournament = async (tournamentId: string, data: any) => {
  await set(ref(database, `tournaments/${tournamentId}`), data);
};

export const subscribeToTournament = (tournamentId: string, callback: (data: any) => void) => {
  const tournamentRef = ref(database, `tournaments/${tournamentId}`);
  return onValue(tournamentRef, (snapshot) => {
    callback(snapshot.val());
  });
};

export const updateTournament = async (tournamentId: string, updates: any) => {
  await update(ref(database, `tournaments/${tournamentId}`), updates);
};

export const updatePlayers = async (tournamentId: string, players: Record<string, any>) => {
  await update(ref(database, `tournaments/${tournamentId}`), { players });
};

export const addRound = async (tournamentId: string, round: any) => {
  const updates: any = {};
  updates[`rounds/${round.id}`] = round;
  await update(ref(database, `tournaments/${tournamentId}`), updates);
};

export const updateMatch = async (tournamentId: string, roundId: string, matchId: string, matchData: any) => {
  await update(ref(database, `tournaments/${tournamentId}/rounds/${roundId}/matches/${matchId}`), matchData);
};

export { database, auth };