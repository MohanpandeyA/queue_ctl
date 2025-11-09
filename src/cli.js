#!/usr/bin/env node
import { Command } from "commander";
import pkg from "../package.json" with { type: "json" };


import enqueueCmd from "./commands/enqueue.js";
import workerCmd from "./commands/worker.js";
import statusCmd from "./commands/status.js";
import listCmd from "./commands/list.js";
import dlqCmd from "./commands/dlq.js";
import configCmd from "./commands/config.js";

const program = new Command();

program
  .name("queuectl")
  .description("CLI-based background job queue system")
  .version(pkg.version);

program.addCommand(enqueueCmd());
program.addCommand(workerCmd());
program.addCommand(statusCmd());
program.addCommand(listCmd());
program.addCommand(dlqCmd());
program.addCommand(configCmd());

program.parseAsync();
