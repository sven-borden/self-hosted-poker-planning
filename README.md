# Planning Poker – Self‑Hosted

## Quick start

```bash
git clone <repo>
cd planning-poker
cp .env.example .env
docker compose up --build
```

* Client http://localhost:3000  
* API/WS http://localhost:4000

## Useful commands (inside server container)

```bash
bun x prisma migrate deploy
bun run db:seed
bun test        # unit/api/socket
```

## CI

GitHub Actions workflow runs:
* Lint & type‑check
* Jest unit/API tests
* Socket tests
* Playwright E2E
* Docker image build & push
