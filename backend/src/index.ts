import 'dotenv/config';
import { prisma } from './lib/prisma';
import { createApp } from './app';
import { autoSeed } from './startup';

const PORT = parseInt(process.env.PORT || '3001', 10);

const app = createApp();

const server = app.listen(PORT, async () => {
  console.log(`PULS backend running on port ${PORT}`);
  await autoSeed(prisma).catch(e => console.error('[seed] failed:', e));
});

async function shutdown() {
  console.log('Shutting down...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
