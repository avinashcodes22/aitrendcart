import cron from "node-cron";
import { harvestTrends } from "./trendHarvester.js";

/* Run every 6 hours */

cron.schedule("0 */6 * * *",async()=>{

  console.log("Running Trend Harvester");

  await harvestTrends();

});