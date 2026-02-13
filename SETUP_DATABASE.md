# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL and get the Badminton Stats API running.

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Alternative: Download Postgres.app
Visit https://postgresapp.com/ and download the installer

### Verify Installation
```bash
psql --version
```

## Step 2: Create Database and User

Open PostgreSQL:
```bash
psql postgres
```

Run these commands in the PostgreSQL prompt:
```sql
-- Create a user
CREATE USER badminton_user WITH PASSWORD 'your_secure_password';

-- Create the database
CREATE DATABASE badminton_stats OWNER badminton_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE badminton_stats TO badminton_user;

-- Exit
\q
```

## Step 3: Configure Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your credentials:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=badminton_stats
DB_USER=badminton_user
DB_PASSWORD=your_secure_password
```

## Step 4: Initialize Database

Run the database initialization script:
```bash
npm run init-db
```

This will create all necessary tables (players, pairs, matches, games).

## Step 5: Start the API Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3000`

Test it: http://localhost:3000/health

## Step 6: Configure Mobile App

1. Find your computer's local IP address:
   - macOS: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig`

2. Update `config.js` in the mobile app root:
```javascript
export const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
// Example: 'http://192.168.1.100:3000/api'
```

3. Restart your Expo app

## Troubleshooting

### Can't connect to PostgreSQL
- Check if PostgreSQL is running: `brew services list`
- Start it: `brew services start postgresql@15`

### Connection refused from mobile app
- Make sure your phone/emulator and computer are on the same network
- Check firewall settings
- For Android Emulator, use: `http://10.0.2.2:3000/api`
- For iOS Simulator, use: `http://localhost:3000/api`

### Database initialization fails
- Check your credentials in `.env`
- Verify database exists: `psql -U badminton_user -d badminton_stats`

### API returns 500 errors
- Check backend logs for errors
- Verify database connection in `.env`
- Make sure database tables are created

## Optional: Import Seed Data

If you want to import existing data from `seedData.json`, create a script or manually insert data:

```bash
cd backend
node scripts/importSeedData.js
```

(You'll need to create this script to parse and insert the JSON data)

## Database Management Tools

### Command Line
```bash
# Connect to database
psql -U badminton_user -d badminton_stats

# List tables
\dt

# View table structure
\d players
\d pairs
\d matches

# Query data
SELECT * FROM matches ORDER BY date DESC LIMIT 10;
```

### GUI Tools
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/

## Production Deployment

For production, consider:
1. Using a hosted PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
2. Setting up environment variables on your server
3. Using a process manager like PM2 for the Node.js backend
4. Setting up HTTPS/SSL
5. Implementing authentication and rate limiting
