import { exec } from "child_process";
import { getConfig } from "../repositories/configRepo.js";

/**
 * Executes a shell command with timeout support.
 * Returns { ok: boolean, stdout: string, stderr: string }
 */
export function runCommand(cmd) {
  const timeout = Number(getConfig("job_timeout_ms") || "30000"); // default 30s
  return new Promise((resolve) => {
    const child = exec(cmd, { timeout }, (error, stdout, stderr) => {
      if (error) {
        resolve({
          ok: false,
          stderr: stderr || error.message,
          stdout: stdout || "",
        });
      } else {
        resolve({ ok: true, stdout, stderr: "" });
      }
    });
  });
}
