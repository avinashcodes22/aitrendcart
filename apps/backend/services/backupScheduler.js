import cron from "node-cron";
import { runBackup } from "./backupService.js";

/* =====================================================
   RUN BACKUP EVERY DAY AT 2AM
===================================================== */

cron.schedule("0 2 * * *",()=>{

  console.log("⏳ Running scheduled backup");

  runBackup();

});