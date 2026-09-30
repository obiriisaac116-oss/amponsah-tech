require('dotenv').config();
const app = require('./app');
const connectDB = require('./utils/db');
const { startReminderJob } = require('./services/reminderJob');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Start daily reminder notifications
  startReminderJob();
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
