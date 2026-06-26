# PULS

A guided bodyweight workout app with timer, muscle visualization, streak tracking, and passkey authentication.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS |
| Backend | Express · Prisma · PostgreSQL |
| Auth | WebAuthn / Passkey (no passwords) |
| Infrastructure | Docker · Docker Compose · GHCR |

## Getting started

**Prerequisites:** Docker and Docker Compose.

```bash
git clone https://github.com/your-username/puls.git
cd puls
docker-compose up -d
```

App is available at `http://localhost`.

## Development

```bash
# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev

# Backend (http://localhost:3001)
cd backend && npm install && npm run dev
```

The dev compose file mounts source directories for hot reload:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Environment variables

Copy and adjust for production:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Long random string (≥ 64 chars) |
| `RPID` | Relying party domain (e.g. `example.com`) |
| `ORIGIN` | Full origin URL (e.g. `https://example.com`) |
| `COOKIE_SECURE` | Set to `true` in production |
| `CORS_ORIGIN` | Allowed CORS origin |

## Versioning

The release version is `v{MAJOR}.{COMMITS}`.

- **Major** — edit the `VERSION` file manually and push
- **Minor** — automatically derived from total commit count on `main`

Every push to `main` builds and publishes Docker images to GHCR and creates a GitHub release.

```
ghcr.io/<owner>/puls-frontend:latest
ghcr.io/<owner>/puls-backend:latest
```

## License

MIT — see [LICENSE](LICENSE).
