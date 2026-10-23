import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import authRouter from './routes/auth';
import workoutsRouter from './routes/workouts';
import historyRouter from './routes/history';
import userRouter from './routes/user';
import exercisesRouter from './routes/exercises';
import customPlansRouter from './routes/customPlans';
import adminRouter from './routes/admin';
import systemPlansRouter from './routes/systemPlans';
import { clientIp, isTrustedProxy } from './lib/client-ip';

const DEV_SESSION_SECRET = 'dev-secret-change-in-production';

function sessionSecret(isProduction: boolean): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret !== DEV_SESSION_SECRET) return secret;
  if (isProduction) throw new Error('SESSION_SECRET must be set in production');
  return DEV_SESSION_SECRET;
}

export interface AppOptions {
  /** Registers extra routes before the API routes (tests use it to sign in) */
  beforeRoutes?: (app: express.Express) => void;
}

export function createApp(options: AppOptions = {}): express.Express {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const secureCookie = process.env.COOKIE_SECURE === 'true';

  const PgSession = connectPgSimple(session);

  // Client → Cloudflare → Traefik (Coolify) → nginx → backend: believe
  // X-Forwarded-For only from private-network hops and Cloudflare. A plain
  // `1` made the Cloudflare edge the client, so everyone behind one edge
  // shared the rate limit.
  app.set('trust proxy', (address: string) => isTrustedProxy(address));

  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(':date[iso] :method :url :status :res[content-length]b - :response-time ms - ip::remote-addr'));
  }

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => ipKeyGenerator(clientIp(req)),
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      name: 'puls.sid',
      secret: sessionSecret(isProduction),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: secureCookie,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      },
    }),
  );

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const UPLOADS_DIR = process.env.UPLOADS_DIR || '/app/uploads';
  app.use(
    '/api/uploads',
    (_req, res, next) => {
      // Uploaded files are images only; never let one run as a page
      res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'");
      next();
    },
    express.static(UPLOADS_DIR),
  );

  options.beforeRoutes?.(app);

  app.use('/api/auth', authRouter);
  app.use('/api/workouts', workoutsRouter);
  app.use('/api/history', historyRouter);
  app.use('/api/user', userRouter);
  app.use('/api/exercises', exercisesRouter);
  app.use('/api/custom-plans', customPlansRouter);
  app.use('/api/system-plans', systemPlansRouter);
  app.use('/api/admin', adminRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: isProduction ? 'Internal server error' : err.message });
  });

  return app;
}
