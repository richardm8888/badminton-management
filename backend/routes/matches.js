const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
        SELECT 
            m.date, 
            m.opponent,
            json_agg(
              json_build_object(
                'set_number', ms.set_number,
                'points_for', ms.points_for,
                'points_against', ms.points_against
              ) ORDER BY ms.set_number
            ) FILTER (WHERE ms.id IS NOT NULL) as sets,
            SUM(CASE WHEN m.result = 'W' THEN 1 ELSE 0 END) as games_for, 
            SUM(CASE WHEN m.result = 'W' THEN 0 ELSE 1 END) as games_against,
            SUM(m.sets_for) as sets_for,
            SUM(m.sets_against) as sets_against,
            SUM(m.points_for) as points_for,
            SUM(m.points_against) as points_against
        FROM matches m
        LEFT JOIN match_sets ms ON m.id = ms.match_id
        GROUP BY 
            m.date, m.opponent
        ORDER BY m.date DESC
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
    sets // Array of set objects: [{pointsFor, pointsAgainst}, ...]
  } = req.body;

  if (!date || !opponent) {
    return res.status(400).json({ error: 'Date and opponent are required' });
  }

  if (!sets || !Array.isArray(sets) || sets.length === 0) {
    return res.status(400).json({ error: 'At least one set is required' });
  }

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Find pair_id if pairing is provided
    let pairId = null;
    if (pairing) {
      // Extract player names from "Player1 / Player2" format
      const [player1, player2] = pairing.split(' / ').map(name => name.trim());
      
      if (player1 && player2) {
        const player1Result = await client.query('SELECT id FROM players WHERE name = $1', [player1]);
        const player2Result = await client.query('SELECT id FROM players WHERE name = $1', [player2]);
        
        if (player1Result.rows.length > 0 && player2Result.rows.length > 0) {
          const pairResult = await client.query(
            'SELECT id FROM pairs WHERE player1_id = $1 AND player2_id = $2',
            [player1Result.rows[0].id, player2Result.rows[0].id]
          );
          
          if (pairResult.rows.length > 0) {
            pairId = pairResult.rows[0].id;
          }
        }
      }
    }

    // Calculate totals from sets
    let setsFor = 0;
    let setsAgainst = 0;
    let pointsFor = 0;
    let pointsAgainst = 0;

    sets.forEach(set => {
      const pFor = parseInt(set.pointsFor, 10) || 0;
      const pAgainst = parseInt(set.pointsAgainst, 10) || 0;
      
      pointsFor += pFor;
      pointsAgainst += pAgainst;
      
      if (pFor > pAgainst) {
        setsFor++;
      } else if (pAgainst > pFor) {
        setsAgainst++;
      }
    });

    // Calculate result based on sets
    let result = 'D'; // Draw
    if (setsFor > setsAgainst) {
      result = 'W'; // Win
    } else if (setsFor < setsAgainst) {
      result = 'L'; // Loss
    }

    // Insert match
    const matchResult = await client.query(
      `INSERT INTO matches (date, pair_id, opponent, result, points_for, points_against, sets_for, sets_against)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [date, pairId, opponent, result, pointsFor, pointsAgainst, setsFor, setsAgainst]
    );

    const matchId = matchResult.rows[0].id;

    // Insert individual sets
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      const pFor = parseInt(set.pointsFor, 10) || 0;
      const pAgainst = parseInt(set.pointsAgainst, 10) || 0;
      
      if (pFor > 0 || pAgainst > 0) { // Only insert sets with actual scores
        await client.query(
          `INSERT INTO match_sets (match_id, set_number, points_for, points_against)
           VALUES ($1, $2, $3, $4)`,
          [matchId, i + 1, pFor, pAgainst]
        );
      }
    }

    await client.query('COMMIT');

    res.status(201).json(matchResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding match:', error);
    res.status(500).json({ error: 'Failed to add match' });
  } finally {
    client.release();
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
