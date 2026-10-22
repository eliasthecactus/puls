import { execSync } from 'node:child_process';

// Applies the real migrations to the test database once per run.
export default function setup() {
  const url = process.env.TEST_DATABASE_URL ?? 'postgresql://test:test@localhost:55432/puls_test';
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: url } });
}
