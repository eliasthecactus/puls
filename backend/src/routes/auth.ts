import { Router, Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorDevice,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const RPID = process.env.RPID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost';
const RP_NAME = 'PULS Workout';

// Cast session to allow arbitrary keys
function sess(req: Request): Record<string, unknown> {
  return req.session as unknown as Record<string, unknown>;
}

router.post('/register/start', async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({
    username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/),
    displayName: z.string().min(1).max(64),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }

  const { username, displayName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    res.status(409).json({ error: 'Username already taken' });
    return;
  }

  const userId = crypto.randomUUID();
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RPID,
    userID: new TextEncoder().encode(userId),
    userName: username,
    userDisplayName: displayName,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    excludeCredentials: [],
  });

  const s = sess(req);
  s['challenge'] = options.challenge;
  s['pendingUserId'] = userId;
  s['pendingUsername'] = username;
  s['pendingDisplayName'] = displayName;
  await new Promise<void>((resolve, reject) => req.session.save((e) => (e ? reject(e) : resolve())));

  res.json(options);
});

router.post('/register/finish', async (req: Request, res: Response): Promise<void> => {
  const s = sess(req);
  const challenge = s['challenge'] as string | undefined;
  const userId = s['pendingUserId'] as string | undefined;
  const username = s['pendingUsername'] as string | undefined;
  const displayName = s['pendingDisplayName'] as string | undefined;

  if (!challenge || !userId || !username || !displayName) {
    res.status(400).json({ error: 'Session expired. Please start registration again.' });
    return;
  }

  const body: RegistrationResponseJSON = req.body;

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: challenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RPID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    res.status(400).json({ error: 'Verification failed' });
    return;
  }

  const { registrationInfo } = verification;
  const credentialId = registrationInfo.credentialID;
  const publicKey = Buffer.from(registrationInfo.credentialPublicKey);
  const counter = registrationInfo.counter;
  const deviceType = registrationInfo.credentialDeviceType;
  const backedUp = registrationInfo.credentialBackedUp;

  await prisma.user.create({
    data: {
      id: userId,
      username,
      displayName,
      credentials: {
        create: {
          credentialId,
          publicKey,
          counter,
          deviceType,
          backedUp,
          transports: body.response.transports ?? [],
        },
      },
    },
  });

  delete s['challenge'];
  delete s['pendingUserId'];
  delete s['pendingUsername'];
  delete s['pendingDisplayName'];
  s['userId'] = userId;
  await new Promise<void>((resolve, reject) => req.session.save((e) => (e ? reject(e) : resolve())));

  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ verified: true, user: { id: user!.id, username: user!.username, displayName: user!.displayName } });
});

router.post('/login/start', async (req: Request, res: Response): Promise<void> => {
  const schema = z.object({ username: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Username required' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
    include: { credentials: true },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const options = await generateAuthenticationOptions({
    rpID: RPID,
    userVerification: 'preferred',
    allowCredentials: user.credentials.map((c) => ({
      id: c.credentialId,
      transports: c.transports as AuthenticatorTransportFuture[],
    })),
  });

  const s = sess(req);
  s['challenge'] = options.challenge;
  s['loginUserId'] = user.id;
  await new Promise<void>((resolve, reject) => req.session.save((e) => (e ? reject(e) : resolve())));

  res.json(options);
});

router.post('/login/finish', async (req: Request, res: Response): Promise<void> => {
  const s = sess(req);
  const challenge = s['challenge'] as string | undefined;
  const loginUserId = s['loginUserId'] as string | undefined;

  if (!challenge || !loginUserId) {
    res.status(400).json({ error: 'Session expired. Please start login again.' });
    return;
  }

  const body: AuthenticationResponseJSON = req.body;

  const dbCredential = await prisma.credential.findUnique({
    where: { credentialId: body.id },
    include: { user: true },
  });

  if (!dbCredential || dbCredential.userId !== loginUserId) {
    res.status(400).json({ error: 'Credential not found' });
    return;
  }

  const authenticator: AuthenticatorDevice = {
    credentialID: dbCredential.credentialId,
    credentialPublicKey: new Uint8Array(dbCredential.publicKey),
    counter: Number(dbCredential.counter),
    transports: dbCredential.transports as AuthenticatorTransportFuture[],
  };

  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: challenge,
    expectedOrigin: ORIGIN,
    expectedRPID: RPID,
    authenticator,
  });

  if (!verification.verified) {
    res.status(400).json({ error: 'Verification failed' });
    return;
  }

  await prisma.credential.update({
    where: { credentialId: body.id },
    data: { counter: verification.authenticationInfo.newCounter },
  });

  delete s['challenge'];
  delete s['loginUserId'];
  s['userId'] = loginUserId;
  await new Promise<void>((resolve, reject) => req.session.save((e) => (e ? reject(e) : resolve())));

  const user = dbCredential.user;
  res.json({ verified: true, user: { id: user.id, username: user.username, displayName: user.displayName } });
});

router.post('/logout', (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.clearCookie('puls.sid');
    res.json({ success: true });
  });
});

router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const userId = sess(req)['userId'] as string | undefined;
  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: 'User not found' });
    return;
  }

  res.json({ user: { id: user.id, username: user.username, displayName: user.displayName } });
});

export default router;
