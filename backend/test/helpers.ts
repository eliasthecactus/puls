import express from 'express';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

export { prisma };

/** The real app plus a test-only sign-in route (sets the session like a passkey login does) */
export function testApp() {
  return createApp({
    beforeRoutes: (app) => {
      app.post('/test/login', express.json(), (req, res) => {
        req.session.userId = req.body.userId;
        req.session.save(() => res.status(204).end());
      });
    },
  });
}

export async function resetDb(): Promise<void> {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT IN ('_prisma_migrations', 'session')`;
  if (tables.length === 0) return;
  const list = tables.map((t) => `"public"."${t.tablename}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE ${list} RESTART IDENTITY CASCADE`);
}

/** Creates a user and returns a supertest agent signed in as them */
export async function signedIn(app: express.Express, username: string) {
  const user = await prisma.user.create({ data: { username, displayName: username } });
  const agent = request.agent(app);
  await agent.post('/test/login').send({ userId: user.id }).expect(204);
  return { user, agent };
}
