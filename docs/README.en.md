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

#### ✅ Interactive Test Execution

- **Status Tracking:** Mark each test as ✓ Pass / ✗ Fail / ⊘ Skip
- **Bug Documentation:** Record bugs directly during testing with free-text fields
- **Time Measurement:** Document test duration in seconds
- **Real-time Progress:** See instantly how many tests are completed/passed/failed

#### 💾 Intelligent Auto-Save

Your work is always protected:
- **Instant:** Changes are saved immediately in the browser (localStorage)
- **Debounced Backend:** After 500ms, changes are automatically persisted to the backend
- **Optimistic UI:** Interface responds immediately without waiting for server responses
- **Indicator:** Status "Saving..." → "Saved" shows the save process

#### 📊 Flexible Export Options

| Format | Description | Ideal for |
|--------|-------------|-----------|
| **Markdown (.md)** | Reconstructed test plan with filled results + summary | Version control (Git) |
| **HTML (.html)** | Self-contained report with embedded CSS, professional design | Stakeholder reports |
| **JSON (.json)** | Structured data with all test metadata | CI/CD integration, automation |

#### 📋 Template System

5 pre-built templates for quick start:

| Template | Content |
|----------|---------|
| **Backend API Testing** | REST API Endpoints, Authentication, CRUD Operations |
| **Frontend UI Testing** | Components, User Flows, Responsive Design |
| **Security Audit** | Penetration Tests, Vulnerability Scans, OWASP |
| **Performance Testing** | Load Tests, Response Times, Bottlenecks |
| **Unraid Container Testing** | Docker, Networking, Storage, WebUI |

#### 🌍 Internationalization (i18n)

Fully bilingual:
- **German** (default)
- **English**

Language selection during first-run setup or anytime in settings. All UI elements, error messages, and validations are translated.

#### 🔐 Secure Single-User System

- **First-Run Setup:** Select language + create user on first access
- **JWT Authentication:** Secure token-based authentication (24h validity)
- **bcrypt Hashing:** Passwords hashed with bcrypt (12 rounds)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  React Frontend (Vite + TypeScript)          │
│  - Zustand State Management                  │
│  - react-i18next (de/en)                     │
│  - Auto-Save (localStorage + backend)        │
└─────────────────────────────────────────────┘
                    ↕ HTTP/JSON
┌─────────────────────────────────────────────┐
│             Fastify Backend                  │
│  - API Routes (Auth, Sessions, Export)       │
│  - JWT Middleware (@fastify/jwt)             │
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

1. **Upload:** `.md` file → Fastify → Markdown Parser → JSON structure → SQLite
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
| **react-i18next** | De-facto standard for React i18n |

---

## ❓ FAQ

**Q: Can I create multiple users?**  
A: No, HELDEVTEST is intentionally designed as a single-user system. For team usage, we recommend separate instances per tester.

**Q: Is my data stored in the cloud?**  
A: No, all data stays locally on your server/container. There are no external connections.

**Q: Can I create custom templates?**  
A: Yes, templates can be saved from successful sessions via the template menu.

**Q: Is HELDEVTEST mobile-friendly?**  
A: No, intentionally desktop-only. Test execution requires a larger screen.

**Q: How does the auto-save logic work?**  
A: Changes → localStorage (instant) → 500ms timer starts → On new change, timer resets → After 500ms idle → Backend UPSERT.

**Q: Can I query the SQLite database externally?**  
A: Yes, the DB is located at `/app/data/heldevtest.db` in the container. You can open it with any SQLite client.

---

## 🔗 Further Documentation

- [⚙️ Installation](installation.en.md)
- [🎓 Usage](usage.en.md)
- [🚀 Deployment](deployment.en.md)

<div align="center">

[⬆ Back to top](#heldevtest-documentation)

</div>
