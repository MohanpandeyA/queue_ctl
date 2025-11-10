import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Jobs to enqueue
const jobs = [
  { command: "echo Success Job" },
  { command: "powershell -NoProfile -Command Start-Sleep -Seconds 2; echo Delayed Job" },
  { command: "notarealcommand", max_retries: 3 },
];

// Enqueue each job
for (const job of jobs) {
  const json = JSON.stringify(job);
  console.log(`\n🟢 Enqueuing Job: ${json}`);
  try {
    execSync(`node ${path.join(__dirname, "../src/cli.js")} enqueue '${json}'`, {
      stdio: "inherit",
      shell: true,
    });
  } catch {
    console.error(`❌ Failed to enqueue job: ${job.command}`);
  }
}
