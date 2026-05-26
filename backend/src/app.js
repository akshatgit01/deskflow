const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./routes/tickets');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── CORS ──
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL].filter(Boolean)
    : true; // allow all in dev

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body Parser ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Routes ──
app.use('/api/tickets', ticketRoutes);

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ error: true, message: 'Route not found' });
});

// ── Global Error Handler ──
app.use(errorHandler);

module.exports = app;
