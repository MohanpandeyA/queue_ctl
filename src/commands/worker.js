import { Command } from "commander";
import { startWorkers } from "../services/worker.js";

export default function () {
  const cmd = new Command("worker")
    .description("Start or manage background workers");

  cmd.command("start")
    .option("--count <n>", "number of workers to start", "1")
    .description("Start one or more workers")
    .action((opts) => {
      const count = parseInt(opts.count);
      startWorkers(count);
    });

  return cmd;
}
