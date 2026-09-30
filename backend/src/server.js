require('dotenv').config();
const app          = require('./app');
const connectDB    = require('./utils/db');
const seedIfEmpty  = require('./utils/seedIfEmpty');
const { startReminderJob } = require('./services/reminderJob');

const PORT = process.env.PORT || 5000;

// Bind port FIRST so Render detects it immediately
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB()
  .then(async () => {
    console.log('Database connected — server fully ready.');
    await seedIfEmpty();   // auto-seed if DB is empty
    startReminderJob();
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    server.close(() => process.exit(1));
  });
