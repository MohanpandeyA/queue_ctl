import { initDB } from "../db/db.js";
import { v4 as uuidv4 } from "uuid"; 
const db = initDB();

// Add a new job
export function enqueue(job) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO jobs(id, command, state, attempts, max_retries,
                      created_at, updated_at, run_at)
     VALUES(@id, @command, 'pending', @attempts, @max_retries,
            @created_at, @updated_at, COALESCE(@run_at, @created_at))`
  ).run({
    id: job.id ?? uuidv4(),           // ✅ auto-generate if not provided
    command: job.command,
    attempts: job.attempts ?? 0,
    max_retries: job.max_retries ?? 3,
    created_at: job.created_at ?? now,
    updated_at: job.updated_at ?? now,
    run_at: job.run_at ?? now,
  });
}

// Atomically pick one pending job ready to run
export function reserveOne() {
  const now = new Date().toISOString();
  const stmt = db.prepare(
    `UPDATE jobs
       SET state='processing', updated_at=?, last_error=NULL
     WHERE id = (
       SELECT id FROM jobs
        WHERE state='pending' AND run_at <= ?
        ORDER BY run_at ASC, created_at ASC
        LIMIT 1
     )
     RETURNING *`
  );
  return stmt.get(now, now) || null;
}

// Mark a job done
export const markCompleted = (id) =>
  db.prepare("UPDATE jobs SET state='completed', updated_at=? WHERE id=?")
    .run(new Date().toISOString(), id);

// Retry scheduling or move to DLQ
export function markFailedAndSchedule(id, attempts, base, maxRetries, errorMsg) {
  const now = new Date();
  const delay = Math.pow(base, attempts);
  const runAt = new Date(now.getTime() + delay * 1000).toISOString();

  db.prepare(
    "UPDATE jobs SET state='failed', attempts=?, updated_at=?, run_at=?, last_error=? WHERE id=?"
  ).run(attempts, now.toISOString(), runAt, errorMsg?.slice(0, 500), id);

  if (attempts > maxRetries) {
    const job = db.prepare("SELECT * FROM jobs WHERE id=?").get(id);
    db.transaction(() => {
      db.prepare(
        "INSERT INTO dlq(id, job_json, failed_at, reason) VALUES(?,?,?,?)"
      ).run(id, JSON.stringify(job), new Date().toISOString(), job.last_error);
      db.prepare("UPDATE jobs SET state='dead' WHERE id=?").run(id);
    })();
  }
}

// Helpers
export const listByState = (state) =>
  db.prepare("SELECT * FROM jobs WHERE state=? ORDER BY created_at DESC").all(state);

export const statusSummary = () =>
  db.prepare("SELECT state, COUNT(*) as count FROM jobs GROUP BY state").all();
