import * as path from "path";
import * as dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("--> REAL DATABASE_URL DIBACA PRISMA:", process.env.DATABASE_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});