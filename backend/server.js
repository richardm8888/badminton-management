const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const playersRoutes = require('./routes/players');
const pairsRoutes = require('./routes/pairs');
const matchesRoutes = require('./routes/matches');

app.use('/api/players', playersRoutes);
app.use('/api/pairs', pairsRoutes);
app.use('/api/matches', matchesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Badminton Stats API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
