import { convertQueue } from "../ai/queue/convertQueue.js";
import { trendQueue } from "../ai/queue/trendQueue.js";

/* =====================================================
   AI JOB MONITOR
   Collects queue statistics for admin dashboard
===================================================== */

export async function getAIJobStats() {

  try {

    const convert = {
      waiting: await convertQueue.getWaitingCount(),
      active: await convertQueue.getActiveCount(),
      completed: await convertQueue.getCompletedCount(),
      failed: await convertQueue.getFailedCount()
    };

    const trends = {
      waiting: await trendQueue.getWaitingCount(),
      active: await trendQueue.getActiveCount(),
      completed: await trendQueue.getCompletedCount(),
      failed: await trendQueue.getFailedCount()
    };

    return {
      convert,
      trends
    };

  }
  catch (err) {

    console.error(
      "AI job monitor error:",
      err.message
    );

    return {
      convert: {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0
      },
      trends: {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0
      }
    };

  }

}