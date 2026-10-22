// Prisma CLI configuration (migrate, generate)
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // Read directly instead of env(): `prisma generate` runs in the Docker build
  // where DATABASE_URL is not set, and only Migrate needs it.
  datasource: { url: process.env.DATABASE_URL },
});
