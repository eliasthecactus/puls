import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app';
import { calculateStreak } from '../src/routes/user';
import { prisma, resetDb, signedIn, testApp } from './helpers';

const app = testApp();

beforeEach(resetDb);
afterAll(() => prisma.$disconnect());

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

describe('admin', () => {
  it('comes from ADMIN_USERNAMES, not from a username anyone can register', async () => {
    const { agent: elias } = await signedIn(app, 'elias');
    await elias.get('/api/admin/users').expect(403);
    expect((await elias.get('/api/auth/me')).body.user.isAdmin).toBe(false);

    const { agent: coach } = await signedIn(app, 'coach');
    const users = await coach.get('/api/admin/users').expect(200);
    expect(users.body).toHaveLength(2);
    expect((await coach.get('/api/auth/me')).body.user.isAdmin).toBe(true);
  });

  it('keeps admin endpoints closed to anonymous callers', async () => {
    await request(app).get('/api/admin/users').expect(401);
    await request(app).post('/api/exercises').send({ nameDE: 'x', nameEN: 'x' }).expect(401);
  });

  it('issues passkey reset tokens that work once', async () => {
    const { agent: coach } = await signedIn(app, 'coach');
    const user = await prisma.user.create({ data: { username: 'lost', displayName: 'Lost' } });
    const res = await coach.post(`/api/admin/users/${user.id}/reset-token`).expect(200);
    await request(app).get(`/api/auth/reset/${res.body.token}`).expect(200);
    await prisma.passkeyResetToken.updateMany({ data: { usedAt: new Date() } });
    await request(app).get(`/api/auth/reset/${res.body.token}`).expect(400);
  });
});

describe('uploads', () => {
  async function exercise() {
    return prisma.exercise.create({ data: { nameDE: 'Liegestütze', nameEN: 'Push-ups', detailDE: '', detailEN: '' } });
  }

  it('stores an image where its URL points and serves it with a locked-down CSP', async () => {
    const { agent } = await signedIn(app, 'coach');
    const ex = await exercise();
    const res = await agent
      .post(`/api/exercises/${ex.id}/image`)
      .attach('image', PNG, { filename: 'pushup.png', contentType: 'image/png' })
      .expect(200);
    const served = await request(app).get(res.body.imageUrl).expect(200);
    expect(served.headers['content-type']).toBe('image/png');
    expect(served.headers['content-security-policy']).toContain("default-src 'none'");
  });

  it('refuses SVG and files whose type does not match the extension', async () => {
    const { agent } = await signedIn(app, 'coach');
    const ex = await exercise();
    await agent
      .post(`/api/exercises/${ex.id}/image`)
      .attach('image', Buffer.from('<svg onload="alert(1)"/>'), { filename: 'x.svg', contentType: 'image/svg+xml' })
      .expect(400);
    await agent
      .post(`/api/exercises/${ex.id}/image`)
      .attach('image', Buffer.from('<script>alert(1)</script>'), { filename: 'x.png', contentType: 'text/html' })
      .expect(400);
  });
});

describe('user data', () => {
  const plan = {
    name: 'Morning',
    sections: [{ id: 's1', label: 'Warm-up', rounds: 1, exercises: [{ exerciseId: 'ub-ch-1', duration: 30 }] }],
  };

  it("can't touch another user's custom plans or history", async () => {
    const { agent: anna } = await signedIn(app, 'anna');
    const { agent: ben } = await signedIn(app, 'ben');
    const created = await anna.post('/api/custom-plans').send(plan).expect(201);
    await ben.patch(`/api/custom-plans/${created.body.id}`).send({ name: 'mine now' }).expect(404);
    await ben.delete(`/api/custom-plans/${created.body.id}`).expect(404);
    expect((await ben.get('/api/custom-plans')).body).toHaveLength(0);

    const entry = await anna
      .post('/api/history')
      .send({ workoutId: 'w1', workoutName: 'Morning', duration: 600 })
      .expect(201);
    await ben.delete(`/api/history/${entry.body.id}`).expect(404);
    expect((await anna.get('/api/history')).body).toHaveLength(1);
  });

  it('needs a session', async () => {
    await request(app).get('/api/custom-plans').expect(401);
    await request(app).get('/api/history').expect(401);
  });
});

describe('auth', () => {
  it('validates registration and refuses taken usernames', async () => {
    await request(app).post('/api/auth/register/start').send({ username: 'a', displayName: 'A' }).expect(400);
    await prisma.user.create({ data: { username: 'taken', displayName: 'T' } });
    await request(app).post('/api/auth/register/start').send({ username: 'taken', displayName: 'T' }).expect(409);
    const ok = await request(app).post('/api/auth/register/start').send({ username: 'fresh', displayName: 'F' }).expect(200);
    expect(ok.body.challenge).toEqual(expect.any(String));
  });

  it('refuses to finish a registration that was never started', async () => {
    await request(app).post('/api/auth/register/finish').send({}).expect(400);
    await request(app).post('/api/auth/login/finish').send({}).expect(400);
  });

  it('requires SESSION_SECRET in production', () => {
    const env = { ...process.env };
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.SESSION_SECRET;
      expect(() => createApp()).toThrow(/SESSION_SECRET/);
    } finally {
      process.env = env;
    }
  });
});

describe('streak', () => {
  afterAll(() => vi.useRealTimers());

  it('counts consecutive days across the October DST change', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-26T09:00:00+01:00'));
    const days = ['2026-10-24T18:00:00+02:00', '2026-10-25T18:00:00+01:00', '2026-10-26T08:00:00+01:00'];
    expect(calculateStreak(days.map((d) => new Date(d)))).toBe(3);
  });

  it('counts yesterday on the day after the March DST change', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-30T09:00:00+02:00'));
    const days = ['2026-03-28T18:00:00+01:00', '2026-03-29T18:00:00+02:00'];
    expect(calculateStreak(days.map((d) => new Date(d)))).toBe(2);
  });
});
