import { Command } from "commander";
import { listDLQ, retryFromDLQ } from "../repositories/dlqRepo.js";

export default function () {
  const cmd = new Command("dlq").description("Dead Letter Queue management");

  cmd.command("list")
    .description("List all dead (failed) jobs")
    .action(() => {
      const rows = listDLQ();
      if (!rows.length) return console.log("🎯 DLQ is empty");
      console.table(rows);
    });

  cmd.command("retry")
    .argument("<id>", "Job ID to retry")
    .description("Move job back to pending from DLQ")
    .action((id) => {
      const ok = retryFromDLQ(id);
      console.log(ok ? "✅ Job moved back to pending." : "❌ Job not found in DLQ.");
    });

  return cmd;
}
