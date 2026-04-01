import { defineConfig } from "prisma/config";
import { PrismaMssql } from "@prisma/adapter-mssql";
import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    adapter: async () => {
      const pool = await sql.connect(process.env.DATABASE_URL!);
      return new PrismaMssql(pool);
    },
  },
});