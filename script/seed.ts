import fs from "fs";
import path from "path";
import ora, { Ora } from "ora";
import chalk from "chalk";
import { glob } from "glob";
import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});
import dbConnect from "../lib/dbConnect";

function panic(spinner: Ora, error: Error, message: string) {
  spinner.fail(message);
  console.error(error);
  process.exit(1);
}

async function main() {
  const log = console.log;

  log("🌱" + chalk.bold(`MongoDB Seeding`));

  const spinner = ora("Connecting to database...").start();
  try {
    const connection = await dbConnect();
    spinner.succeed("Connected to database");

    spinner.start("Loading data files...");
    const dataFiles = glob.sync("data/*.json");
    spinner.succeed(`Loaded ${dataFiles.length} data files`);

    try {
      for (const file of dataFiles) {
        spinner.start(`Seeding ${file}...`);
        const data = JSON.parse(
          fs.readFileSync(path.resolve(process.cwd(), file), "utf-8")
        );

        const collectionName = file.split("\\")[1].split(".")[0];
        const collection = (await import(`../models/${collectionName}`))
          .default;
        await collection.deleteMany({});

        const result = await collection.insertMany(data);

        // write result back to file to update ids
        fs.writeFileSync(
          path.resolve(process.cwd(), file),
          JSON.stringify(result, null, 2)
        );

        spinner.succeed(`Seeded ${file}`);
      }

      log("👍 ", chalk.gray.underline(`Finished Seeding`));
    } catch (e: any) {
      panic(spinner, e, "Failed to seed database");
    } finally {
      await connection.connection.close();
    }
  } catch (error: any) {
    panic(spinner, error, "Failed to connect to database");
  }
}

main();
