require('dotenv').config();
const app = require('./app');
const connectDB = require('./utils/db');
const { startReminderJob } = require('./services/reminderJob');

const PORT = process.env.PORT || 5000;

// Start listening FIRST so Render detects the open port immediately.
// Then connect to MongoDB — if it fails the process exits with a clear message.
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB()
  .then(() => {
    console.log('Database connected — server fully ready.');
    startReminderJob();
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    console.error('Shutting down — check MONGODB_URI environment variable.');
    server.close(() => process.exit(1));
  });
