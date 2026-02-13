const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all players
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
        SELECT 
            p.id,
            p.name,
            COUNT(m.id) as games_played,
            COUNT(CASE WHEN m.sets_for > m.sets_against THEN 1 END) as games_for,
            COUNT(CASE WHEN m.sets_for < m.sets_against THEN 1 END) as games_against,
            CASE 
                WHEN COUNT(m.id) > 0 
                THEN ROUND(COUNT(CASE WHEN m.sets_for > m.sets_against THEN 1 END)::decimal / COUNT(m.id), 4)
            ELSE 0 
            END as game_win_percent,
            COALESCE(SUM(m.sets_for), 0) as sets_won,
            COALESCE(SUM(m.sets_against), 0) as sets_lost,
            CASE 
                WHEN (SUM(m.sets_for) + SUM(m.sets_against)) > 0 
                THEN ROUND(SUM(m.sets_for)::decimal / (SUM(m.sets_for) + SUM(m.sets_against)), 4)
            ELSE 0 
            END as set_win_percent,
            COALESCE(SUM(m.points_for), 0) as points_for,
            COALESCE(SUM(m.points_against), 0) as points_against
        FROM players p
        LEFT JOIN matches m ON m.pair_id IN (SELECT id FROM pairs WHERE player1_id = p.id OR player2_id = p.id)
        GROUP BY p.id
        ORDER BY p.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Add a new player
router.post('/', async (req, res) => {
  const { name } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO players (name) VALUES ($1) RETURNING *',
      [name.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Player already exists' });
    }
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
});

// Delete a player
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM players WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

module.exports = router;
