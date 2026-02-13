require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../db');
const seedData = require('../../assets/data/seedData.json');

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Seeding players...');
    for (const playerName of seedData.players) {
      await client.query(
        'INSERT INTO players (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [playerName]
      );
    }
    console.log(`✓ ${seedData.players.length} players inserted`);

    console.log('Seeding pairs...');
    for (const pair of seedData.pairs) {
      // Get player IDs
      const player1Result = await client.query(
        'SELECT id FROM players WHERE name = $1',
        [pair.player1]
      );
      const player2Result = await client.query(
        'SELECT id FROM players WHERE name = $1',
        [pair.player2]
      );

      if (player1Result.rows.length > 0 && player2Result.rows.length > 0) {
        await client.query(
          `INSERT INTO pairs (player1_id, player2_id)
           VALUES ($1, $2)
           ON CONFLICT (player1_id, player2_id) DO NOTHING`,
          [player1Result.rows[0].id, player2Result.rows[0].id]
        );
      }
    }
    console.log(`✓ ${seedData.pairs.length} pairs inserted`);

    console.log('Seeding matches...');
    let matchCount = 0;
    for (const match of seedData.games) {
      // Find the pair_id by looking up players
      let pairId = null;
      if (match.player1 && match.player2) {
        const player1Result = await client.query(
          'SELECT id FROM players WHERE name = $1',
          [match.player1]
        );
        const player2Result = await client.query(
          'SELECT id FROM players WHERE name = $1',
          [match.player2]
        );
        console.log(`Looking up players for match: ${match.player1} / ${match.player2}`);
        console.log('Player 1 result:', player1Result.rows);
        console.log('Player 2 result:', player2Result.rows);

        if (player1Result.rows.length > 0 && player2Result.rows.length > 0) {
          const pairResult = await client.query(
            'SELECT id FROM pairs WHERE (player1_id = $1 AND player2_id = $2) OR (player1_id = $2 AND player2_id = $1)',
            [player1Result.rows[0].id, player2Result.rows[0].id]
          );
          console.log(`Looking up pair for match: ${match.player1} / ${match.player2}`);
          if (pairResult.rows.length > 0) {
            pairId = pairResult.rows[0].id;
          }
        }
      }

      await client.query(
        `INSERT INTO matches (
          date, pair_id, opponent, result,
          points_for, points_against, sets_for, sets_against
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          match.date,
          pairId,
          match.opponent,
          match.result,
          match.points_for || 0,
          match.points_against || 0,
          match.sets_won || 0,
          match.sets_lost || 0
        ]
      );
      matchCount++;
    }
    console.log(`✓ ${matchCount} matches inserted`);

    await client.query('COMMIT');
    console.log('\n✅ Database seeded successfully!');
    console.log(`   Players: ${seedData.players.length}`);
    console.log(`   Pairs: ${seedData.pairs.length}`);
    console.log(`   Matches: ${matchCount}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
