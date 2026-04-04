<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="180"/>

# HELDEVTEST Documentation

**Complete English Documentation**

[🏠 Home](../README.md) | [🇩🇪 Deutsch](README.de.md)

</div>

---

## 📚 Table of Contents

- [Overview](#overview)
- [Installation](installation.en.md)
- [Usage](usage.en.md)
- [Deployment](deployment.en.md)
- [Architecture](#architecture)
- [FAQ](#faq)

---

## 🎯 Overview

HELDEVTEST is a modern web tool for **interactive execution and documentation of software tests**. It combines the simplicity of Markdown with a powerful test management interface.

### Key Features

#### 📝 Markdown-based Test Plans

Write your test plans in familiar Markdown format:

```markdown
# Backend API Testing

## 1. Authentication Tests

### 1.1 Login

- [ ] **Test 1.1.1:** Successful login with valid credentials
- [ ] **Test 1.1.2:** Login fails with invalid password
```

HELDEVTEST automatically detects the structure and creates an interactive test interface.

#### 🧙 Import Wizard

When uploading a Markdown file, HELDEVTEST automatically detects structural problems (empty sections, unsupported formats). An Import Wizard offers three resolution strategies:

- **Skip** — ignore problematic sections
- **Import Empty** — include empty sections without tests
- **Convert to Freetext** — turn problematic sections into free-text note fields

#### ✅ Interactive Test Execution

- **Status Tracking:** Mark each test as ✓ Pass / ✗ Fail / ⊘ Skip
- **Bug Documentation:** Record bugs directly during testing with free-text fields
- **Bug Templates:** 3 pre-filled templates (Default / Crash+Error / Visual Bug)
- **Time Measurement:** Optional timer per test
- **Real-time Progress:** Total / Completed / Passed / Failed counters

#### ⌨️ Keyboard Shortcuts

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

#### 🖱️ Quick Actions & Bulk

- **Right-click context menu** per test: Copy name / Mark Pass/Fail/Skip / Start timer
- **Bulk Actions:** Select multiple tests → Mark all as Pass/Fail/Skip

#### 💾 Intelligent Auto-Save

- **Instant:** Changes saved immediately in localStorage
- **Debounced Backend:** After 500ms idle, changes persisted to SQLite
- **Indicator:** "Saving..." → "Saved"

#### 📊 Flexible Export Options

| Format | Description | Ideal for |
|--------|-------------|-----------|
| **Markdown (.md)** | Reconstructed test plan with results + summary | Version control (Git) |
| **HTML (.html)** | Self-contained report with embedded CSS | Stakeholder reports |
| **JSON (.json)** | Structured data with all test metadata | CI/CD integration |

#### 🛠️ MD Builder

Create test plans from scratch without writing Markdown manually:

- Drag & Drop section reordering
- Section Wizard: choose title and type (Test Checklist / Freetext Note)
- Live preview of generated Markdown
- Download as `.md` or save as template

#### 🗂️ Session Management

- **Cloning:** Copy a session structure (without results) for regression testing
- **Archiving:** Archive completed sessions to keep the dashboard clean
- **Lazy Loading:** Dashboard paginates at 20 sessions per page
- **Filters:** Filter by status, search by name

#### 📋 Template System

5 pre-built templates for quick start:

| Template | Content |
|----------|---------|
| **Backend API Testing** | REST API Endpoints, Authentication, CRUD Operations |
| **Frontend UI Testing** | Components, User Flows, Responsive Design |
| **Security Audit** | OWASP Top 10, Auth, Input Validation, Headers |
| **Performance Testing** | Load Tests, Response Times, Bottlenecks |
| **Unraid Container Testing** | Docker, Networking, Storage, WebUI |

Custom templates can be saved from any session.

#### 🎨 UI/UX

- **Dark Mode:** Manual toggle, persisted in localStorage
- **Accent Color:** Customizable accent color in settings
- **Toast Notifications:** Top-right, auto-dismiss 3–5s — no browser alerts
- **Confirm Dialogs:** Modal for destructive actions (delete, discard)
- **Session Timeout Warning:** Notification 5 minutes before JWT expires
- **Virtual Scrolling:** react-window for sessions with >50 tests

#### 🔒 Security

- JWT authentication (24h validity)
- bcrypt password hashing (12 rounds)
- Rate limiting: Login 5/15min, API 20/min
- Input validation: `.md` upload only
- Database backup download (SQLite `.db`)

#### 🌍 Internationalization (i18n)

- **German** (default)
- **English**
- Language selection during first-run setup or anytime in Settings

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  React Frontend (Vite + TypeScript)          │
│  - Zustand State Management                  │
│  - react-i18next (de/en)                     │
│  - react-window (Virtual Scrolling)          │
│  - Auto-Save (localStorage + backend)        │
└─────────────────────────────────────────────┘
                    ↕ HTTP/JSON
┌─────────────────────────────────────────────┐
│             Fastify Backend                  │
│  - API Routes (Auth, Sessions, Export)       │
│  - JWT Middleware (@fastify/jwt)             │
│  - Rate Limiter (Login + API)                │
│  - i18next-http-middleware (de/en)           │
│  - Markdown Parser (marked)                  │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│        SQLite Database (WAL mode)            │
│  - users (id, username, password_hash, lang) │
│  - test_sessions (structure JSON, progress)  │
│  - test_results (UPSERT per test_path)       │
│  - screenshots (BLOB storage)                │
│  - templates (reusable test plans)           │
└─────────────────────────────────────────────┘
```

### Data Flow

1. **Upload:** `.md` file → Import Wizard (if issues) → Markdown Parser → JSON structure → SQLite
2. **Display:** Frontend loads session → React renders interactive UI
3. **Execution:** User changes status/bugs → localStorage (instant) → Backend (500ms debounced) → SQLite UPSERT
4. **Export:** User clicks Export → Backend generates MD/HTML/JSON → Download

### Technology Decisions

| Decision | Rationale |
|----------|-----------|
| **Node.js 24** | Latest LTS version, native ESM support |
| **TypeScript Strict** | Type safety, better DX, fewer bugs |
| **Fastify** | Faster than Express, native TypeScript support |
| **better-sqlite3** | Synchronous, no network overhead, WAL for concurrency |
| **Zustand** | Lightweight, no boilerplate, hook-based |
| **Vite** | Faster than Webpack, native ESM, HMR |
| **react-window** | Virtual scrolling for large test lists |
| **react-i18next** | De-facto standard for React i18n |

---

## ❓ FAQ

**Q: Can I create multiple users?**  
A: No, HELDEVTEST is intentionally designed as a single-user system. For team usage, we recommend separate instances per tester.

**Q: Is my data stored in the cloud?**  
A: No, all data stays locally on your server/container. There are no external connections.

**Q: Can I create custom templates?**  
A: Yes, templates can be saved from any session via the template menu, or built in the MD Builder.

**Q: Is HELDEVTEST mobile-friendly?**  
A: No, intentionally desktop-only. Test execution requires a larger screen.

**Q: How does the auto-save logic work?**  
A: Changes → localStorage (instant) → 500ms timer starts → On new change, timer resets → After 500ms idle → Backend UPSERT.

**Q: Can I query the SQLite database externally?**  
A: Yes, the DB is located at `/app/data/heldevtest.db` in the container. You can open it with any SQLite client, or download it via Settings → Backup.

---

## 🔗 Further Documentation

- [⚙️ Installation](installation.en.md)
- [🎓 Usage](usage.en.md)
- [🚀 Deployment](deployment.en.md)

<div align="center">

[⬆ Back to top](#heldevtest-documentation)

</div>
