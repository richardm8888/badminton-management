require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../db');

const clearDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Clearing database...');
    
    // Delete in order to respect foreign key constraints    
    await client.query('DELETE FROM matches');
    console.log('✓ Matches cleared');
    
    await client.query('DELETE FROM pairs');
    console.log('✓ Pairs cleared');
    
    await client.query('DELETE FROM players');
    console.log('✓ Players cleared');

    await client.query('COMMIT');
    console.log('\n✅ Database cleared successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error clearing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

clearDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Clear failed:', error);
    process.exit(1);
  });
