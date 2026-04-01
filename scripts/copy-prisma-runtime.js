const fs = require("fs");
const path = require("path");

const sourceDir = path.join(process.cwd(), "node_modules", ".prisma");
const targetDir = path.join(process.cwd(), "build", "node_modules", ".prisma");

if (!fs.existsSync(sourceDir)) {
  console.warn(`[copy-prisma-runtime] Source directory not found: ${sourceDir}`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`[copy-prisma-runtime] Copied Prisma runtime to ${targetDir}`);
