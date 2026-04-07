<p align="center">
  <img src="frontend/public/logo.png" alt="HELDEVTEST" width="450" height="450"/>
</p>

<p align="center">
  <strong>Interactive Test Documentation Tool</strong>
</p>

<p align="center">
  <a href="README.de.md">🇩🇪 Deutsch</a> &nbsp;|&nbsp; 🇬🇧 English
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen" alt="Node.js">
  <img src="https://img.shields.io/github/license/Kreuzbube88/heldevtest" alt="License">
  <img src="https://img.shields.io/badge/platform-Unraid-orange" alt="Platform">
</p>

---

HELDEVTEST is a self-hosted tool for interactive execution and documentation of software tests. Upload markdown-based test plans, execute tests step by step, document results and bugs, and export professional reports — all in one container, no cloud dependency, no subscription.

---

## Features

- **Session Management** — Upload `.md` test plans, clone sessions, archive completed runs, paginated dashboard (20 per page)
- **Import Wizard** — Auto problem detection with 3 resolution strategies: Skip / Import Empty / Convert to Freetext
- **Test Execution** — Pass / Fail / Skip per test, free-text bug field, 3 bug templates (Default / Crash / Visual Bug), optional test timer
- **Bulk Actions** — Multi-select, mark all Pass/Fail/Skip, right-click context menu per test
- **Keyboard Shortcuts** — `n` next / `p` prev / `1-3` status / `s` save / `/` search / `Ctrl+E` export / `Ctrl+A` select all
- **MD Builder** — Drag & Drop section editor, Test + Freetext sections, live preview, download as `.md`, save as template
- **Export** — Markdown (results + summary), HTML (self-contained), JSON
- **Templates** — 5 built-in (Backend API, Frontend UI, Security Audit, Performance, Unraid) + custom templates
- **Auto-Save** — localStorage (instant) + backend (500ms debounce) — no data loss
- **Virtual Scrolling** — react-window for sessions with >50 tests
- **Dark Mode + Accent Color** — Manual toggle, persisted in localStorage
- **JWT Auth** — 24h token, bcrypt (12 rounds), rate limiting (login: 5/15min, API: 20/min)
- **i18n** — German (default) + English, language selection on first run and in settings

---

## Installation

### Unraid Community Apps (recommended)

1. Open the **Apps** tab in Unraid
2. Search for **HELDEVTEST**
3. Click **Install** and follow the template

HELDEVTEST will be available at `http://YOUR-UNRAID-IP:3001`.

### Docker Compose

```yaml
services:
  heldevtest:
    image: ghcr.io/kreuzbube88/heldevtest:latest
    container_name: heldevtest
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - JWT_SECRET=your_secret_here   # openssl rand -hex 32
      - NODE_ENV=production
    volumes:
      - /mnt/user/appdata/heldevtest/data:/app/data
```

---

## Quick Start

After installation, open the web UI and complete the **first-run setup** — choose your language and create your account. Then upload any `.md` test plan to create your first session and start executing tests immediately.

---

## Documentation

Full documentation is available in the [`docs/`](docs/README.md) folder in both German and English, covering installation, test plan format, export, templates, keyboard shortcuts, and API reference.

---

## Requirements

- **Data volume** `/app/data` — required for database and uploaded files
- **JWT_SECRET** environment variable — required, generate with `openssl rand -hex 32`
- No Docker socket or host mounts required

---

## License

MIT © 2024 HEL*Apps
