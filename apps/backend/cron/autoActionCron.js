import cron from "node-cron";
import { runAutoActions } from "../services/aiAutoActionEngine.js";

export function startAutoActionCron() {

  console.log("⏰ Auto Action Cron Started");

  // Every 4 hours
  cron.schedule("0 */4 * * *", async () => {

    console.log("🤖 Running Auto Actions...");

    await runAutoActions();

  });

}