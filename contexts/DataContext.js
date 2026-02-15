import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [games, setGames] = useState([]);
  const [teamTotals, setTeamTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [playersData, pairsData, matchesData, gamesData, totalsData] = await Promise.all([
        api.getPlayers(),
        api.getPairs(),
        api.getMatches(),
        api.getGames(),
        api.getTeamTotals(),
      ]);

      // Convert players from objects to strings for backward compatibility
      setPlayers(playersData);
      setPairs(pairsData);
      setMatches(matchesData);
      setGames(gamesData);
      setTeamTotals(totalsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addPlayer = async (name) => {
    if (!name || name.trim().length === 0) return;
    
    try {
      await api.addPlayer(name.trim());
      await loadData(); // Refresh all data
    } catch (err) {
      console.error('Error adding player:', err);
      throw err;
    }
  };

  const addPair = async (player1, player2) => {
    try {
      await api.addPair(player1, player2);
      await loadData(); // Refresh all data
    } catch (err) {
      console.error('Error adding pair:', err);
      throw err;
    }
  };

  const addMatch = async (match) => {
    try {
      await api.addMatch(match);
      await loadData(); // Refresh all data
    } catch (err) {
      console.error('Error adding match:', err);
      throw err;
    }
  };

  const value = {
    players,
    pairs,
    matches,
    games,
    teamTotals,
    loading,
    error,
    addPlayer,
    addPair,
    addMatch,
    refreshData: loadData,
  };

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
};
