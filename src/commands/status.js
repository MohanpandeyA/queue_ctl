import { Command } from "commander";
import { statusSummary } from "../repositories/jobsRepo.js";

export default function () {
  const cmd = new Command("status")
    .description("Show summary of job states")
    .action(() => {
      const summary = statusSummary();
      const stats = Object.fromEntries(summary.map((r) => [r.state, r.count]));
      console.table(stats);
    });

  return cmd;
}
