import React, { createContext, useState, useEffect } from 'react';
import seedData from '../assets/data/seedData.json';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [games, setGames] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamTotals, setTeamTotals] = useState({});

  useEffect(() => {
    // load seed data on mount
    setPlayers(seedData.players || []);
    setPairs(seedData.pairs || []);
    setGames(seedData.games || []);
    setMatches(seedData.matches || []);
    setTeamTotals(seedData.team_totals || {});
  }, []);

  const addPlayer = (name) => {
    if (!name || name.trim().length === 0) return;
    setPlayers((prev) => [...prev, name.trim()]);
  };

  const addMatch = (match) => {
    // match should contain {date, opponent, result, gamesFor, gamesAgainst}
    setMatches((prev) => [...prev, match]);
  };

  const value = {
    players,
    pairs,
    games,
    matches,
    teamTotals,
    addPlayer,
    addMatch,
  };

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
};
