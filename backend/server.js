require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not defined. Check your environment variables on Render.');
  process.exit(1);
}

// Start HTTP server immediately — Render needs the port to be bound quickly
const server = app.listen(PORT, () => {
  console.log(`🚀  DeskFlow API running on port ${PORT}`);
});

// Connect to MongoDB separately with auto-retry
const RETRY_INTERVAL_MS = 5000;
const MAX_RETRIES = 10;
let retries = 0;

async function connectWithRetry() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅  MongoDB connected');
  } catch (err) {
    retries++;
    console.error(`❌  MongoDB connection failed (attempt ${retries}/${MAX_RETRIES}): ${err.message}`);
    if (retries < MAX_RETRIES) {
      console.log(`🔄  Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      setTimeout(connectWithRetry, RETRY_INTERVAL_MS);
    } else {
      console.error('❌  Max retries reached. Check MONGODB_URI and Atlas Network Access (whitelist 0.0.0.0/0).');
    }
  }
}

connectWithRetry();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
