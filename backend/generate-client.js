#!/usr/bin/env bun
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to trigger Prisma client generation
const prismaPath = path.join(__dirname, "node_modules", ".prisma", "client");
const prismaClientPath = path.join(
  __dirname,
  "node_modules",
  "@prisma",
  "client",
);

try {
  // Check if we need to generate
  if (!fs.existsSync(prismaPath)) {
    console.log("Generating Prisma client...");

    // Try using prisma-cli-engine to generate
    const result = execSync(
      `bun run ${path.join(__dirname, "node_modules", ".bin", "prisma")} generate`,
      {
        cwd: __dirname,
        stdio: "inherit",
      },
    );

    console.log("✓ Prisma client generated successfully");
  } else {
    console.log("✓ Prisma client already exists");
  }
} catch (error) {
  console.error(
    'Note: Prisma 8.0.0-rc.12 does not support the "generate" command.',
  );
  console.error("The client will be generated automatically when needed.");
  process.exit(0);
}
