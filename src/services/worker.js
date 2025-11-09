import {
  reserveOne,
  markCompleted,
  markFailedAndSchedule,
} from "../repositories/jobsRepo.js";
import { getConfig } from "../repositories/configRepo.js";
import { runCommand } from "./execCommand.js";

/**
 * Start background workers.
 * Each worker loops: pick job → execute → update state.
 */
export function startWorkers(count = 1) {
  let shuttingDown = false;

  // Create N worker loops
  const workers = Array.from({ length: count }, (_, i) => makeWorker(`w${i + 1}`));

  function makeWorker(id) {
    let active = false;

    const tick = async () => {
      if (shuttingDown) return;

      const pollMs = Number(getConfig("poll_interval_ms") || "500");
      const base = Number(getConfig("backoff_base") || "2");

      const job = reserveOne(); // atomically claim a job
      if (!job) {
        // no job found → sleep briefly, then check again
        return setTimeout(tick, pollMs);
      }

      active = true;
      console.log(`[${id}] Processing job: ${job.id}`);

      const result = await runCommand(job.command);
      if (result.ok) {
        console.log(`[${id}] ✅ Job ${job.id} completed successfully`);
        markCompleted(job.id);
      } else {
        console.log(`[${id}] ❌ Job ${job.id} failed`);
        const attempts = job.attempts + 1;
        const maxRetries = Number(job.max_retries);
        markFailedAndSchedule(job.id, attempts, base, maxRetries, result.stderr);
      }

      active = false;
      setImmediate(tick); // immediately look for next job
    };

    tick(); // start first loop

    return {
      id,
      stop: async () => {
        // Wait for current job to finish
        return new Promise((resolve) => {
          const check = () => (active ? setTimeout(check, 100) : resolve());
          check();
        });
      },
    };
  }

  async function shutdown() {
    shuttingDown = true;
    console.log("Gracefully shutting down workers...");
    await Promise.all(workers.map((w) => w.stop()));
  }

  // Handle Ctrl+C or SIGTERM
  process.once("SIGINT", async () => {
    await shutdown();
    process.exit(0);
  });
  process.once("SIGTERM", async () => {
    await shutdown();
    process.exit(0);
  });

  console.log(`🚀 ${count} worker(s) started. Press Ctrl+C to stop.`);
}
