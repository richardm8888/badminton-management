# Badminton Stats API

Backend API for the Badminton Stats mobile application.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a PostgreSQL database:
```sql
CREATE DATABASE badminton_stats;
```

3. Copy the environment file and configure it:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=badminton_stats
DB_USER=your_username
DB_PASSWORD=your_password
```

4. Initialize the database tables:
```bash
npm run init-db
```

5. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Players
- `GET /api/players` - Get all players
- `POST /api/players` - Add a new player
  - Body: `{ "name": "Player Name" }`
- `DELETE /api/players/:id` - Delete a player

### Pairs
- `GET /api/pairs` - Get all pairs with stats
- `POST /api/pairs` - Add a new pair
  - Body: `{ "player1": "Player 1", "player2": "Player 2" }`
- `DELETE /api/pairs/:id` - Delete a pair

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/totals` - Get team totals
- `POST /api/matches` - Add a new match
  - Body: `{ "date": "2026-02-13", "pairing": "Player1 / Player2", "opponent": "Team Name", "result": "W", "pointsFor": 42, "pointsAgainst": 38, "setsFor": 2, "setsAgainst": 1 }`
- `DELETE /api/matches/:id` - Delete a match

### Health Check
- `GET /health` - Check if API is running

## Database Schema

### players
- id (serial, primary key)
- name (varchar, unique)
- created_at (timestamp)

### pairs
- id (serial, primary key)
- pair_name (varchar)
- player1, player2 (varchar)
- matches_played, games_for, games_against, sets_won, sets_lost, points_for, points_against (integer)
- game_win_percent, set_win_percent (decimal)
- created_at (timestamp)

### matches
- id (serial, primary key)
- date (date)
- pairing (varchar)
- opponent (varchar)
- result (varchar, W/L/D)
- points_for, points_against, sets_for, sets_against (integer)
- created_at (timestamp)

### games
- id (serial, primary key)
- match_id (foreign key to matches)
- player1, player2 (varchar)
- games_for, games_against, sets_won, sets_lost, points_for, points_against (integer)
- created_at (timestamp)
