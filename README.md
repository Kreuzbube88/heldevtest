<div align="center">

<img src="frontend/public/logo.png" alt="HELDEVTEST Logo" width="180"/>

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

### 🇩🇪 Hauptfunktionen

| Feature | Beschreibung |
|---------|-------------|
| 📝 **Markdown-Upload** | Laden Sie strukturierte `.md` Testpläne hoch – automatische Erkennung der Test-Hierarchie |
| ✅ **Interaktive Ausführung** | Markieren Sie Tests als ✓ Bestanden / ✗ Fehlgeschlagen / ⊘ Übersprungen |
| 🐛 **Bug-Tracking** | Erfassen Sie Fehler direkt beim Test mit Freitextfeldern |
| ⏱️ **Zeit-Erfassung** | Dokumentieren Sie Testdauer in Sekunden |
| 💾 **Auto-Save** | Änderungen werden sofort lokal (localStorage) + nach 500ms im Backend gespeichert |
| 📊 **Export** | Exportieren Sie Ergebnisse als **Markdown**, **HTML** oder **JSON** |
| 📋 **Templates** | 5 vorgefertigte Vorlagen (Backend API, Frontend UI, Security, Performance, Unraid) |
| 🌍 **i18n** | Vollständig zweisprachig: **Deutsch** (Standard) + **Englisch** |
| 🔐 **Single-User Auth** | First-Run Setup mit Benutzername + Passwort (JWT-basiert) |
| 📈 **Fortschritts-Tracking** | Echtzeit-Übersicht: Gesamt / Abgeschlossen / Bestanden / Fehlgeschlagen |

### 🇬🇧 Key Features

| Feature | Description |
|---------|-------------|
| 📝 **Markdown Upload** | Upload structured `.md` test plans – automatic test hierarchy detection |
| ✅ **Interactive Execution** | Mark tests as ✓ Pass / ✗ Fail / ⊘ Skip |
| 🐛 **Bug Tracking** | Document bugs directly during testing with free-text fields |
| ⏱️ **Time Tracking** | Record test duration in seconds |
| 💾 **Auto-Save** | Changes saved instantly (localStorage) + after 500ms to backend |
| 📊 **Export** | Export results as **Markdown**, **HTML**, or **JSON** |
| 📋 **Templates** | 5 pre-built templates (Backend API, Frontend UI, Security, Performance, Unraid) |
| 🌍 **i18n** | Fully bilingual: **German** (default) + **English** |
| 🔐 **Single-User Auth** | First-run setup with username + password (JWT-based) |
| 📈 **Progress Tracking** | Real-time overview: Total / Completed / Passed / Failed |

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
│   │   ├── middleware/     # Auth + Error Handling
│   │   ├── i18n.ts         # Backend i18n Config
│   │   └── server.ts       # Fastify Server
│   └── locales/            # Translations (de/en)
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── pages/          # React Pages
│   │   ├── components/     # Reusable Components
│   │   ├── stores/         # Zustand Stores
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

## 📝 License

MIT — [Kreuzbube88](https://github.com/Kreuzbube88)

<div align="center">

Like HELDEVTEST? ⭐ Star the repository!

</div>
