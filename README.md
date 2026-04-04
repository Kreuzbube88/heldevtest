<div align="center">

<img src="frontend/public/logo.png" alt="HELDEVTEST Logo" width="360"/>

# HELDEVTEST

**Interaktives Test-Dokumentations-Tool**  
*Interactive Test Documentation Tool*

[![Docker Build](https://github.com/Kreuzbube88/heldevtest/actions/workflows/docker-build.yml/badge.svg)](https://github.com/Kreuzbube88/heldevtest/actions/workflows/docker-build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

[🇩🇪 Deutsche Dokumentation](docs/README.de.md) | [🇬🇧 English Documentation](docs/README.en.md)

</div>

---

## 🎯 Was ist HELDEVTEST? | What is HELDEVTEST?

**🇩🇪 Deutsch:**

HELDEVTEST ist ein modernes Tool zur interaktiven Ausführung und Dokumentation von Software-Tests. Laden Sie Markdown-basierte Testpläne hoch, führen Sie Tests durch, dokumentieren Sie Ergebnisse und exportieren Sie professionelle Reports – alles in einer Anwendung.

**🇬🇧 English:**

HELDEVTEST is a modern tool for interactive execution and documentation of software tests. Upload markdown-based test plans, execute tests, document results, and export professional reports – all in one application.

---

## ✨ Features | Funktionen

### 🎯 Session Management

| Feature | DE | EN |
|---------|----|----|
| Markdown-Upload | Strukturierte `.md` Testpläne hochladen | Upload structured `.md` test plans |
| Import Wizard | Automatische Problem-Erkennung + 3 Lösungsstrategien (Skip / Import Empty / Convert to Freetext) | Auto problem detection + 3 resolution strategies |
| Freetext Sections | Freie Notizfelder neben Test-Checklisten | Free-text note sections alongside test checklists |
| Session Cloning | Session kopieren (Struktur ohne Ergebnisse) | Clone session (structure without results) |
| Session Archivierung | Sessions archivieren und ausblenden | Archive and hide sessions |
| Lazy Loading | Dashboard paginiert (20 Sessions pro Seite) | Paginated dashboard (20 sessions per page) |
| Fortschritts-Tracking | Echtzeit: Gesamt / Abgeschlossen / Pass / Fail | Real-time: Total / Completed / Pass / Fail |
| Auto-Save | localStorage (sofort) + Backend (500ms Debounce) | localStorage (instant) + backend (500ms debounce) |

### 📝 Test Execution

| Feature | DE | EN |
|---------|----|----|
| Status Tracking | Pass / Fail / Skip pro Test | Pass / Fail / Skip per test |
| Bug-Dokumentation | Freitext-Fehlerfeld pro Test | Free-text bug field per test |
| Bug Templates | 3 vorgefertigte Vorlagen (Default / Crash / Visual Bug) | 3 pre-filled templates (Default / Crash / Visual Bug) |
| Test Timer | Optionale Zeitmessung pro Test | Optional timer per test |
| Virtual Scrolling | react-window bei >50 Tests | react-window for >50 tests |
| Test-Filter & Suche | Status-Filter + Textsuche (300ms Debounce) | Status filter + text search (300ms debounce) |
| Bulk Actions | Mehrfachauswahl + Mark all Pass/Fail/Skip | Multi-select + mark all Pass/Fail/Skip |
| Quick Actions | Rechtsklick-Kontextmenü pro Test | Right-click context menu per test |
| Keyboard Shortcuts | n / p / 1 / 2 / 3 / s / / / Esc / Ctrl+E / Ctrl+A / Ctrl+D | See table below |

**Keyboard Shortcuts:**

| Key | Action |
|-----|--------|
| `n` | Next unfinished test |
| `p` | Previous test |
| `1` | Mark as Pass |
| `2` | Mark as Fail |
| `3` | Mark as Skip |
| `s` | Save |
| `/` | Focus search |
| `Esc` | Close dialog |
| `Ctrl+E` | Export menu |
| `Ctrl+A` | Select all tests |
| `Ctrl+D` | Deselect all |

### 🛠️ MD Builder

| Feature | DE | EN |
|---------|----|----|
| Drag & Drop Erstellung | Sections per Drag & Drop sortieren | Drag & Drop section reordering |
| Section Wizard | Title + Type auswählen (Test / Freetext) | Title + type selection (Test / Freetext) |
| Test-Sections | Checklisten-Sections | Checklist sections |
| Freetext-Sections | Notiz-Sections | Note sections |
| Live Preview | Vorschau des generierten Markdowns | Preview of generated markdown |
| Download | Als `.md` herunterladen | Download as `.md` |
| Als Vorlage speichern | In Template-Bibliothek speichern | Save to template library |

### 📊 Export & Templates

| Feature | DE | EN |
|---------|----|----|
| Markdown Export | Testplan mit ausgefüllten Ergebnissen + Summary | Test plan with filled results + summary |
| HTML Export | Self-contained Report (inline CSS) | Self-contained report (inline CSS) |
| JSON Export | Strukturierte Daten | Structured data |
| 5 Vorlagen | Backend API / Frontend UI / Security / Performance / Unraid | Backend API / Frontend UI / Security / Performance / Unraid |
| Custom Templates | Eigene Vorlagen speichern | Save custom templates |

### 🎨 UI/UX

| Feature | DE | EN |
|---------|----|----|
| Dark Mode | Manueller Toggle (gespeichert in localStorage) | Manual toggle (saved in localStorage) |
| Accent Color | Anpassbare Akzentfarbe | Customizable accent color |
| Toast System | Top-right, auto-dismiss 3–5s | Top-right, auto-dismiss 3–5s |
| Confirm Dialogs | Modal für destruktive Aktionen | Modal for destructive actions |
| Session Timeout | Warnung 5 Min vor Logout | Warning 5 min before logout |
| Focus Indicators | Barrierefreiheit (Accessibility) | Accessibility focus indicators |

### 🔒 Security & DevOps

| Feature | DE | EN |
|---------|----|----|
| JWT Auth | 24h Token, bcrypt (12 Runden) | 24h token, bcrypt (12 rounds) |
| Rate Limiting | Login: 5/15min, API: 20/min | Login: 5/15min, API: 20/min |
| DB Backup | SQLite `.db` Download | SQLite `.db` download |
| Docker Health Check | GET /health prüft DB-Verbindung | GET /health checks DB connection |
| Input Sanitization | Upload-Validierung (.md only) | Upload validation (.md only) |

### 🌐 Internationalization

- **Deutsch** (Standard / Default)
- **English** (Fallback)
- Sprachauswahl beim First-Run Setup + jederzeit in Settings

---

## 🚀 Quick Start

### 🐳 Docker (Empfohlen | Recommended)

#### Option 1: Docker Compose

```bash
# Repository klonen | Clone repository
git clone https://github.com/Kreuzbube88/heldevtest
cd heldevtest

# Container starten | Start container
docker-compose up -d

# Zugriff | Access
# http://localhost:3001
```

#### Option 2: Docker Run

```bash
docker run -d \
  -p 3001:3001 \
  -v heldevtest-data:/app/data \
  -e JWT_SECRET=your-secret-key-change-me \
  --name heldevtest \
  ghcr.io/kreuzbube88/heldevtest:latest
```

### 📦 Unraid Community Store

**🇩🇪** Apps → Community Applications → **"HELDEVTEST"** suchen → Install → Port `3001` → Apply → `http://UNRAID-IP:3001`

**🇬🇧** Apps → Community Applications → Search **"HELDEVTEST"** → Install → Port `3001` → Apply → `http://UNRAID-IP:3001`

XML Template: `heldevtest.xml`

---

## 📖 Dokumentation | Documentation

| 🇩🇪 Deutsch | 🇬🇧 English |
|------------|------------|
| [📘 Hauptdokumentation](docs/README.de.md) | [📘 Main Documentation](docs/README.en.md) |
| [⚙️ Installation](docs/installation.de.md) | [⚙️ Installation](docs/installation.en.md) |
| [🎓 Verwendung](docs/usage.de.md) | [🎓 Usage](docs/usage.en.md) |
| [🚀 Deployment](docs/deployment.de.md) | [🚀 Deployment](docs/deployment.en.md) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 24 |
| **Backend** | Fastify 4 + TypeScript |
| **Database** | better-sqlite3 (WAL mode) |
| **Auth** | @fastify/jwt + bcryptjs |
| **i18n Backend** | i18next + i18next-http-middleware |
| **Frontend** | React 18 + Vite 5 + TypeScript |
| **State** | Zustand |
| **Virtual Scrolling** | react-window |
| **i18n Frontend** | react-i18next |
| **Icons** | lucide-react |

---

## 🗂️ Projekt-Struktur | Project Structure

```
heldevtest/
├── backend/                 # Fastify Backend
│   ├── src/
│   │   ├── database/       # SQLite Schema + Connection
│   │   ├── services/       # Business Logic (Auth, Parser, Export)
│   │   ├── routes/         # API Endpoints
│   │   ├── middleware/     # Auth + Rate Limiting + Error Handling
│   │   ├── i18n.ts         # Backend i18n Config
│   │   └── server.ts       # Fastify Server
│   └── locales/            # Translations (de/en)
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/          # React Pages
│   │   ├── components/     # Reusable Components + Builder
│   │   ├── stores/         # Zustand Stores
│   │   ├── hooks/          # Custom Hooks (Keyboard, Debounce)
│   │   ├── api/            # API Client
│   │   └── styles/         # Design System
│   └── public/
│       ├── locales/        # Frontend Translations (de/en)
│       ├── logo.png
│       └── favicon.png
├── docs/                   # Documentation (de + en)
├── .github/workflows/      # CI/CD
├── Dockerfile
├── docker-compose.yml
├── heldevtest.xml          # Unraid Template
└── README.md
```

---

## 🔧 Development

```bash
# Backend
cd backend && npm install && npm run dev   # http://localhost:3001

# Frontend
cd frontend && npm install && npm run dev  # http://localhost:3000
```

---

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server Port |
| `HOST` | `0.0.0.0` | Server Host |
| `DB_PATH` | `data/heldevtest.db` | SQLite Database Path |
| `JWT_SECRET` | **(required)** | JWT Signing Secret |
| `NODE_ENV` | `production` | Node Environment |

---

## 🔌 API

```
POST /api/auth/setup          First-run user setup
POST /api/auth/login          Login
POST /api/auth/check          Token validation

GET  /api/sessions            List sessions (paginated)
GET  /api/sessions/:id        Get session
POST /api/sessions/upload     Upload .md file
POST /api/sessions/:id/clone  Clone session
PUT  /api/sessions/:id        Update session
PUT  /api/sessions/:id/archive    Archive session
PUT  /api/sessions/:id/unarchive  Unarchive session
DELETE /api/sessions/:id      Delete session

GET  /api/templates           List templates
POST /api/templates           Create template
DELETE /api/templates/:id     Delete template

GET  /api/export/:id/:format  Export session (md/html/json)

GET  /api/backup/download     Download SQLite database

GET  /health                  Health check
```

---

## 📝 License

MIT — [Kreuzbube88](https://github.com/Kreuzbube88)

---

> **Hinweis:** Dieses gesamte Projekt wurde mit Unterstützung von Claude Code entwickelt und erstellt. Es ist nicht für die öffentliche Verbreitung oder Veröffentlichung im Internet vorgesehen.
>
> **Note:** This entire project was developed and created with the support of Claude Code. It is not intended for public distribution or publication on the internet.

<div align="center">

Like HELDEVTEST? ⭐ Star the repository!

</div>
