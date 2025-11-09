import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const DB_PATH = path.join(__dirname, "../../queue.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const SCHEMA = fs.readFileSync(SCHEMA_PATH, "utf8");

let db;

export function initDB() {
  if (db) return db; // reuse if already initialized

  db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);

  // Insert default configuration values
  const insertConfig = db.prepare(
    "INSERT INTO config(key,value) VALUES(?,?) ON CONFLICT(key) DO NOTHING"
  );

  db.transaction(() => {
    insertConfig.run("max_retries", "3");
    insertConfig.run("backoff_base", "2");
    insertConfig.run("poll_interval_ms", "500");
    insertConfig.run("job_timeout_ms", "30000");
  })();

  return db;
}
