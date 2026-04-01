const fs = require("fs");
const path = require("path");

const nodeModules = path.join(process.cwd(), "node_modules");
const buildNodeModules = path.join(process.cwd(), "build", "node_modules");

fs.mkdirSync(buildNodeModules, { recursive: true });

// Copy .prisma
const dotPrisma = path.join(nodeModules, ".prisma");
if (fs.existsSync(dotPrisma)) {
  const dest = path.join(buildNodeModules, ".prisma");
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(dotPrisma, dest, { recursive: true });
  console.log("[copy-prisma-runtime] Copied .prisma ✓");
} else {
  console.error("[copy-prisma-runtime] ERROR: .prisma not found!");
  process.exit(1);
}

// Copy @prisma (Prisma 7.x puts generated client here)
const atPrisma = path.join(nodeModules, "@prisma");
if (fs.existsSync(atPrisma)) {
  const dest = path.join(buildNodeModules, "@prisma");
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(atPrisma, dest, { recursive: true });
  console.log("[copy-prisma-runtime] Copied @prisma ✓");
} else {
  console.error("[copy-prisma-runtime] ERROR: @prisma not found!");
  process.exit(1);
}

console.log("[copy-prisma-runtime] Done! All Prisma files copied.");