const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
        SELECT 
            date, 
            opponent, 
            SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) as games_for, 
            SUM(CASE WHEN result = 'W' THEN 0 ELSE 1 END) as games_against,
            SUM(sets_for) as sets_for,
            SUM(sets_against) as sets_against,
            SUM(points_for) as points_for,
            SUM(points_against) as points_against
        FROM matches 
        GROUP BY 
            date, opponent
        ORDER BY date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get team totals
router.get('/totals', async (req, res) => {
  try {
    const result = await db.query(`
        SELECT 
            COUNT(*) as total_matches,
            SUM(CASE WHEN games_for > games_against THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN games_for < games_against THEN 1 ELSE 0 END) as losses,
            SUM(CASE WHEN games_for = games_against THEN 1 ELSE 0 END) as draws,
            CASE 
            WHEN COUNT(*) > 0 
                THEN ROUND(SUM(CASE WHEN games_for > games_against THEN 1 ELSE 0 END)::decimal / COUNT(*), 4)
                ELSE 0 
            END as win_percent,
            SUM(sets_for) as sets_for,
            SUM(sets_against) as sets_against,
            SUM(points_for) as points_for,
            SUM(points_against) as points_against
        from (
            SELECT 
                date, 
                opponent, 
                SUM(CASE WHEN result = 'W' THEN 1 ELSE 0 END) as games_for, 
                SUM(CASE WHEN result = 'W' THEN 0 ELSE 1 END) as games_against,
                SUM(sets_for) as sets_for,
                SUM(sets_against) as sets_against,
                SUM(points_for) as points_for,
                SUM(points_against) as points_against
            FROM matches 
            GROUP BY 
                date, opponent
            ORDER BY date DESC
        ) as matches
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching totals:', error);
    res.status(500).json({ error: 'Failed to fetch totals' });
  }
});

// Add a new match
router.post('/', async (req, res) => {
  const { 
    date, 
    pairing, 
    opponent, 
    result, 
    pointsFor, 
    pointsAgainst, 
    setsFor, 
    setsAgainst 
  } = req.body;

  if (!date || !opponent || !result) {
    return res.status(400).json({ error: 'Date, opponent, and result are required' });
  }

  try {
    // Find pair_id if pairing is provided
    let pairId = null;
    if (pairing) {
      // Extract player names from "Player1 / Player2" format
      const [player1, player2] = pairing.split(' / ').map(name => name.trim());
      
      if (player1 && player2) {
        const player1Result = await db.query('SELECT id FROM players WHERE name = $1', [player1]);
        const player2Result = await db.query('SELECT id FROM players WHERE name = $1', [player2]);
        
        if (player1Result.rows.length > 0 && player2Result.rows.length > 0) {
          const pairResult = await db.query(
            'SELECT id FROM pairs WHERE player1_id = $1 AND player2_id = $2',
            [player1Result.rows[0].id, player2Result.rows[0].id]
          );
          
          if (pairResult.rows.length > 0) {
            pairId = pairResult.rows[0].id;
          }
        }
      }
    }

    // Insert match
    const matchResult = await db.query(
      `INSERT INTO matches (date, pair_id, opponent, result, points_for, points_against, sets_for, sets_against)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [date, pairId, opponent, result, pointsFor || 0, pointsAgainst || 0, setsFor || 0, setsAgainst || 0]
    );

    res.status(201).json(matchResult.rows[0]);
  } catch (error) {
    console.error('Error adding match:', error);
    res.status(500).json({ error: 'Failed to add match' });
  }
});

// Delete a match
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM matches WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

module.exports = router;
