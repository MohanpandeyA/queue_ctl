-- Enable Write-Ahead Logging mode for better performance and concurrent access
PRAGMA journal_mode = WAL;

-- Enforce foreign key constraints to maintain relational data integrity
PRAGMA foreign_keys = ON;


-- ========================
-- CONFIGURATION TABLE
-- ========================
-- Stores system-wide settings for your job queue (like max workers, retry delay, etc.)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,   -- Setting name (unique key)
  value TEXT NOT NULL     -- Setting value
);


-- ========================
-- JOBS TABLE (MAIN QUEUE)
-- ========================
-- Stores all jobs submitted to the queue system.
-- Each job has an ID, command to execute, current state, and timestamps.
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,    -- Unique job ID (usually a UUID)
  command TEXT NOT NULL,  -- The shell command or script to execute
  state TEXT NOT NULL CHECK(state IN ('pending','processing','completed','failed','dead')), 
                          -- Job’s current status (restricted to allowed values)
  attempts INTEGER NOT NULL DEFAULT 0,   -- Number of attempts made so far
  max_retries INTEGER NOT NULL DEFAULT 3,-- Maximum number of retry attempts allowed
  created_at TEXT NOT NULL,              -- Timestamp when job was created
  updated_at TEXT NOT NULL,              -- Timestamp when job was last updated
  run_at TEXT NOT NULL DEFAULT (datetime('now')), 
                                          -- When the job should start running
  last_error TEXT                         -- Error message from last failed attempt
);


-- ========================
-- JOBS INDEX
-- ========================
-- Creates an index to quickly find jobs by state and run time.
-- Speeds up queries like: SELECT * FROM jobs WHERE state='pending' ORDER BY run_at;
CREATE INDEX IF NOT EXISTS idx_jobs_state_runat ON jobs(state, run_at);


-- ========================
-- DEAD LETTER QUEUE (DLQ)
-- ========================
-- Stores jobs that permanently failed after max retries.
-- Useful for debugging or re-processing failed jobs later.
CREATE TABLE IF NOT EXISTS dlq (
  id TEXT PRIMARY KEY,     -- ID of the failed job
  job_json TEXT NOT NULL,  -- JSON representation of the job data
  failed_at TEXT NOT NULL, -- Timestamp when the job finally failed
  reason TEXT              -- Human-readable reason for failure
);
