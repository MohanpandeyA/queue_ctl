import { initDB } from "../db/db.js";

const db = initDB();

// Get a single config value
export const getConfig = (key) =>
  db.prepare("SELECT value FROM config WHERE key=?").get(key)?.value;

// Set or update a config key
export const setConfig = (key, value) =>
  db.prepare(
    "INSERT INTO config(key,value) VALUES(?,?) \
     ON CONFLICT(key) DO UPDATE SET value=excluded.value"
  ).run(key, value);

// Return all config pairs
export const getAllConfig = () =>
  db.prepare("SELECT key, value FROM config ORDER BY key").all();
