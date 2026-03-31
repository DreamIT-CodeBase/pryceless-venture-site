import { PrismaClient } from "@prisma/client";

import { createPrismaClient } from "@/lib/prisma-factory";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const getPrismaClient = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
};

// Delay Prisma creation until a route or page actually performs a database call.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client as unknown as object, property, receiver);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
