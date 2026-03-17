/**
 * Sample Express API - Entry point
 * Used for CoDev demo: indexing, Ask mode, API docs, Article, Diátaxis
 */

const express = require('express');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Sample API running on http://localhost:${PORT}`);
});
