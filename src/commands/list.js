import { Command } from "commander";
import { listByState } from "../repositories/jobsRepo.js";

export default function () {
  const cmd = new Command("list")
    .option("--state <s>", "Filter by state (pending|processing|completed|failed|dead)", "pending")
    .description("List jobs by state")
    .action((opts) => {
      const jobs = listByState(opts.state);
      if (jobs.length === 0) return console.log(`No jobs found in state: ${opts.state}`);
      console.table(jobs.map(j => ({
        id: j.id,
        command: j.command,
        attempts: j.attempts,
        state: j.state,
        run_at: j.run_at
      })));
    });

  return cmd;
}
