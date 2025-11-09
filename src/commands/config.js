import { Command } from "commander";
import { getAllConfig, getConfig, setConfig } from "../repositories/configRepo.js";

export default function () {
  const cmd = new Command("config").description("Manage queue configuration");

  cmd.command("get")
    .argument("[key]", "Optional key")
    .action((key) => {
      if (key) console.log(`${key} = ${getConfig(key)}`);
      else console.table(getAllConfig());
    });

  cmd.command("set")
    .argument("<key>")
    .argument("<value>")
    .action((key, value) => {
      setConfig(key, value);
      console.log(`✅ Updated ${key} = ${value}`);
    });

  return cmd;
}
