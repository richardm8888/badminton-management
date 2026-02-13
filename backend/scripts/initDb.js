require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../db');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Grant necessary permissions
    try {
      await client.query(`GRANT ALL ON SCHEMA public TO ${process.env.DB_USER};`);
      await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${process.env.DB_USER};`);
      await client.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${process.env.DB_USER};`);
    } catch (permError) {
      console.log('Permission grant skipped (may require superuser):', permError.message);
    }

    // Players table
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pairs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pairs (
        id SERIAL PRIMARY KEY,
        player1_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        player2_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player1_id, player2_id)
      );
    `);

    // Matches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        pair_id INTEGER REFERENCES pairs(id) ON DELETE SET NULL,
        opponent VARCHAR(255) NOT NULL,
        result VARCHAR(1) NOT NULL CHECK (result IN ('W', 'L', 'D')),
        points_for INTEGER DEFAULT 0,
        points_against INTEGER DEFAULT 0,
        sets_for INTEGER DEFAULT 0,
        sets_against INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const initializeDatabase = async () => {
  try {
    await createTables();
    console.log('Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();
