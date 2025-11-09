import { Command } from "commander";
import { enqueue } from "../repositories/jobsRepo.js";
import { randomUUID } from "node:crypto";

export default function () {
  const cmd = new Command("enqueue")
    .argument("<jobJson>", "JSON with job details (e.g. '{\"command\":\"echo hi\"}')")
    .description("Add a new job to the queue")
    .action((jobJson) => {
      const job = JSON.parse(jobJson);
      job.id = job.id || randomUUID();
      job.command = job.command || "echo 'Hello'";
      enqueue(job);
      console.log(`✅ Job enqueued successfully: ${job.id}`);
    });

  return cmd;
}
