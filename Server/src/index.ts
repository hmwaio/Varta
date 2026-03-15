import "dotenv/config"
import app from "./app.js";
import { testConnection } from "./services/email/email.service.js";
// import { startCleanupJob } from "./jobs/cleanup.job.js";

const PORT = process.env.PORT || 3000;

/* Start Server */
app.listen(PORT, async () => {
  console.log(`App is listening on http://localhost:${PORT}`);
  // startCleanupJob();

  await testConnection();
});