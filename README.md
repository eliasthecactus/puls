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

Create a `docker-compose.yml` and adjust the environment variables for your setup:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: puls
      POSTGRES_USER: puls
      POSTGRES_PASSWORD: changeme
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U puls -d puls']
      interval: 5s
      timeout: 5s
      retries: 10

  backend:
    image: ghcr.io/eliasthecactus/puls-backend:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://puls:changeme@postgres:5432/puls
      SESSION_SECRET: replace_with_a_long_random_string_at_least_64_chars
      RPID: localhost
      ORIGIN: http://localhost
      PORT: '3001'
      NODE_ENV: production
      COOKIE_SECURE: 'false'
      CORS_ORIGIN: http://localhost
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:3001/api/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5

  frontend:
    image: ghcr.io/eliasthecactus/puls-frontend:latest
    restart: unless-stopped
    ports:
      - '80:80'
    environment:
      BACKEND_URL: http://backend:3001
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Then start the stack:

```bash
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
ghcr.io/eliasthecactus/puls-frontend:latest
ghcr.io/eliasthecactus/puls-backend:latest
```

## License

MIT — see [LICENSE](LICENSE).
