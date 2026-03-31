import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";

import { env } from "./env";

export const createPrismaClient = () => {
  const adapter = new PrismaMssql(env.databaseUrl, { schema: "dbo" });
  return new PrismaClient({ adapter });
};
