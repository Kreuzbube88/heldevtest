# HELDEVTEST

Interactive test documentation tool for uploading markdown test plans, executing tests with auto-save, and exporting results.

## Features

- **Markdown Test Plans** - Upload `.md` files with structured test cases
- **Interactive Execution** - Mark tests as Pass/Fail/Skip with bug tracking
- **Auto-Save** - Changes saved to localStorage (instant) + backend (500ms debounce)
- **Export** - Export results as Markdown, HTML, or JSON
- **i18n** - German (default) and English with user preference
- **Single-User Auth** - First-run setup with JWT authentication
- **Templates** - Pre-built test plan templates

## Tech Stack

**Backend:** Node.js 24 + TypeScript, Fastify 4, better-sqlite3 (WAL), i18next, @fastify/jwt + bcryptjs

**Frontend:** React 18 + Vite 5, TypeScript strict, Zustand, react-i18next, lucide-react

## Quick Start

### Docker (Recommended)

```bash
docker-compose up -d
```

Or with docker run:

```bash
docker run -d \
  -p 3001:3001 \
  -v heldevtest-data:/app/data \
  -e JWT_SECRET=your-secret-key \
  --name heldevtest \
  ghcr.io/kreuzbube88/heldevtest:latest
```

Access at: http://localhost:3001

### Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend dev server: http://localhost:3000 — Backend API: http://localhost:3001

## First-Run Setup

1. Access the application
2. **Step 1:** Select language (German or English)
3. **Step 2:** Create username and password
4. Login and start testing

## Usage

### Upload Test Plan
Click "Upload Test" on the dashboard and select a `.md` file with test structure.

### Execute Tests
- Mark tests as Pass / Fail / Skip
- Add bug descriptions
- Track duration (seconds)
- Auto-save every 500ms

### Export Results
- **Markdown** — Reconstructed `.md` with results
- **HTML** — Self-contained report with styling
- **JSON** — Structured data for automation

### Templates
Pre-built templates: Backend API, Frontend UI, Security Audit, Performance, Unraid Container

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `HOST` | 0.0.0.0 | Server host |
| `DB_PATH` | data/heldevtest.db | SQLite database path |
| `JWT_SECRET` | (required) | JWT signing secret |
| `NODE_ENV` | production | Node environment |

## Deployment

### Unraid
Import `heldevtest.xml` into Unraid Community Applications.

### Docker Compose
See `docker-compose.yml` for production configuration.

### Manual
```bash
cd backend && npm run build
cd frontend && npm run build
# Set environment variables, then:
cd backend && node dist/server.js
```

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── database/       # SQLite schema + connection
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth + error handling
│   │   ├── types/          # TypeScript interfaces
│   │   ├── i18n.ts         # Backend i18n config
│   │   └── server.ts       # Fastify setup
│   ├── locales/            # Backend translations (de/en)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # Reusable components
│   │   ├── stores/         # Zustand stores
│   │   ├── api/            # API client
│   │   ├── styles/         # Design system
│   │   └── main.tsx
│   ├── public/
│   │   ├── locales/        # Frontend translations (de/en)
│   │   ├── logo.png
│   │   └── favicon.png
│   └── package.json
├── .github/workflows/      # CI/CD (Docker build + release)
├── Dockerfile              # Multi-stage production build
├── docker-compose.yml      # Docker Compose config
├── heldevtest.xml          # Unraid template
└── README.md
```

## License

MIT — [Kreuzbube88](https://github.com/Kreuzbube88)
