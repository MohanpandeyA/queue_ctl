import { initDB } from "../db/db.js";
const db = initDB();

export const listDLQ = () =>
  db.prepare("SELECT id, failed_at, reason FROM dlq ORDER BY failed_at DESC").all();

export function retryFromDLQ(id) {
  const row = db.prepare("SELECT * FROM dlq WHERE id=?").get(id);
  if (!row) return false;
  const job = JSON.parse(row.job_json);
  job.state = "pending";
  job.attempts = 0;
  job.run_at = new Date().toISOString();

  db.transaction(() => {
    db.prepare("DELETE FROM dlq WHERE id=?").run(id);
    db.prepare(
      "UPDATE jobs SET state='pending', attempts=0, run_at=?, updated_at=?, last_error=NULL WHERE id=?"
    ).run(job.run_at, new Date().toISOString(), id);
  })();
  return true;
}
