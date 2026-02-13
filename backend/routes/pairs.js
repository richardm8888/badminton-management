const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all pairs with calculated stats
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.id,
        p.player1_id,
        p.player2_id,
        pl1.name as player1,
        pl2.name as player2,
        pl1.name || ' / ' || pl2.name as pair_name,
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
      FROM pairs p
      JOIN players pl1 ON p.player1_id = pl1.id
      JOIN players pl2 ON p.player2_id = pl2.id
      LEFT JOIN matches m ON p.id = m.pair_id
      GROUP BY p.id, pl1.name, pl2.name
      ORDER BY pair_name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pairs:', error);
    res.status(500).json({ error: 'Failed to fetch pairs' });
  }
});

// Add a new pair
router.post('/', async (req, res) => {
  const { player1, player2 } = req.body;
  
  if (!player1 || !player2) {
    return res.status(400).json({ error: 'Both players are required' });
  }

  if (player1 === player2) {
    return res.status(400).json({ error: 'Players must be different' });
  }

  try {
    // Get player IDs
    const player1Result = await db.query('SELECT id FROM players WHERE name = $1', [player1]);
    const player2Result = await db.query('SELECT id FROM players WHERE name = $1', [player2]);

    if (player1Result.rows.length === 0 || player2Result.rows.length === 0) {
      return res.status(400).json({ error: 'One or both players not found' });
    }

    const player1Id = player1Result.rows[0].id;
    const player2Id = player2Result.rows[0].id;

    const result = await db.query(
      `INSERT INTO pairs (player1_id, player2_id) 
       VALUES ($1, $2) RETURNING id`,
      [player1Id, player2Id]
    );

    // Return the pair with calculated stats (will be zeros for new pair)
    const newPair = await db.query(`
      SELECT 
        p.id,
        pl1.name as player1,
        pl2.name as player2,
        pl1.name || ' / ' || pl2.name as pair_name,
        0 as matches_played,
        0 as games_for,
        0 as games_against,
        0 as game_diff,
        0 as game_win_percent,
        0 as sets_won,
        0 as sets_lost,
        0 as set_diff,
        0 as set_win_percent,
        0 as points_for,
        0 as points_against,
        0 as points_diff
      FROM pairs p
      JOIN players pl1 ON p.player1_id = pl1.id
      JOIN players pl2 ON p.player2_id = pl2.id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(newPair.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Pair already exists' });
    }
    console.error('Error adding pair:', error);
    res.status(500).json({ error: 'Failed to add pair' });
  }
});

// Delete a pair
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM pairs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pair not found' });
    }

    res.json({ message: 'Pair deleted successfully' });
  } catch (error) {
    console.error('Error deleting pair:', error);
    res.status(500).json({ error: 'Failed to delete pair' });
  }
});

module.exports = router;
