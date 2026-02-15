import { API_URL } from '../config';

class ApiService {
  // Players
  async getPlayers() {
    const response = await fetch(`${API_URL}/players`);
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  }

  async addPlayer(name) {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add player');
    }
    return response.json();
  }

  async deletePlayer(id) {
    const response = await fetch(`${API_URL}/players/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete player');
    return response.json();
  }

  // Pairs
  async getPairs() {
    const response = await fetch(`${API_URL}/pairs`);
    if (!response.ok) throw new Error('Failed to fetch pairs');
    return response.json();
  }

  async addPair(player1, player2) {
    const response = await fetch(`${API_URL}/pairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1, player2 }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add pair');
    }
    return response.json();
  }

  async deletePair(id) {
    const response = await fetch(`${API_URL}/pairs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete pair');
    return response.json();
  }

  // Matches
  async getMatches() {
    const response = await fetch(`${API_URL}/matches`);
    if (!response.ok) throw new Error('Failed to fetch matches');
    return response.json();
  }

  async getGames() {
    const response = await fetch(`${API_URL}/matches/games`);
    if (!response.ok) throw new Error('Failed to fetch games');
    return response.json();
  }

  async getTeamTotals() {
    const response = await fetch(`${API_URL}/matches/totals`);
    if (!response.ok) throw new Error('Failed to fetch totals');
    return response.json();
  }

  async addMatch(matchData) {
    const response = await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add match');
    }
    return response.json();
  }

  async deleteMatch(id) {
    const response = await fetch(`${API_URL}/matches/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete match');
    return response.json();
  }
}

export default new ApiService();
