import { PrismaClient } from "@prisma/client";

import { createPrismaClient } from "@/lib/prisma-factory";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const replacePrismaClient = () => {
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
};

const getPrismaClient = (property?: PropertyKey) => {
  const client = globalForPrisma.prisma ?? replacePrismaClient();

  // In dev, HMR can keep an older generated client instance alive after
  // `prisma generate`. Recreate once when a newly added model delegate is missing.
  if (
    typeof property === "string" &&
    property &&
    !property.startsWith("$") &&
    !Reflect.has(client as unknown as object, property)
  ) {
    const refreshedClient = replacePrismaClient();
    if (Reflect.has(refreshedClient as unknown as object, property)) {
      return refreshedClient;
    }
  }

  return client;
};

// Delay Prisma creation until a route or page actually performs a database call.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient(property);
    const value = Reflect.get(client as unknown as object, property, receiver);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
