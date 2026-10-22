import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

// Environment for the API under test. Must run before src/ is imported.
process.env.NODE_ENV = 'test';
process.env.TZ = 'Europe/Zurich';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://test:test@localhost:55432/puls_test';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.ADMIN_USERNAMES = 'coach';
process.env.UPLOADS_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'puls-uploads-'));
