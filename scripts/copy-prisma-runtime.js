const fs = require("fs");
const path = require("path");

const sourceDir = path.join(process.cwd(), "node_modules", ".prisma");
const targetDir = path.join(process.cwd(), "build", "node_modules", ".prisma");
const sourceClientEntry = path.join(sourceDir, "client", "default.js");
const targetClientEntry = path.join(targetDir, "client", "default.js");

if (!fs.existsSync(sourceDir) || !fs.existsSync(sourceClientEntry)) {
  console.error(
    `[copy-prisma-runtime] Prisma runtime is missing after build. Expected ${sourceClientEntry}`,
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

if (!fs.existsSync(targetClientEntry)) {
  console.error(
    `[copy-prisma-runtime] Prisma runtime copy is incomplete. Expected ${targetClientEntry}`,
  );
  process.exit(1);
}

console.log(`[copy-prisma-runtime] Copied Prisma runtime to ${targetDir}`);
