# CLAUDE.md — HELDEVTEST

Interactive test documentation tool. Upload .md test plans, execute tests, auto-save, export results.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js 24, TypeScript strict |
| Frontend | React 18, Vite 5, react-router-dom v6 |
| State | Zustand |
| Icons | lucide-react |
| Styling | CSS custom properties — `/src/styles/variables.css` |
| Backend | Fastify 4 |
| Auth | @fastify/jwt + bcryptjs — single user, first-run setup |
| DB | better-sqlite3 (WAL, no ORM) |
| Markdown | marked |
| Export | template literals (HTML) |
| i18n Backend | i18next + i18next-http-middleware + i18next-fs-backend |
| i18n Frontend | react-i18next + i18next-browser-languagedetector + i18next-http-backend |
| Assets | `/frontend/public/logo.png` + `/frontend/public/favicon.png` (MUST USE) |

## Architecture

- Single container: Fastify serves API + React SPA
- Upload .md → parse structure → interactive UI → auto-save (localStorage + backend debounced 500ms) → export (MD/HTML/JSON)
- First-run: language selection + username+password setup on first access
- **Desktop-only** — no mobile

## Database

- users (id, username, password_hash, language, created_at)
- test_sessions (id, user_id, name, filename, markdown_structure JSON, created_at, updated_at, status, total_tests, completed_tests, passed_tests, failed_tests, skipped_tests)
- test_results (id, session_id, test_path, status, bugs, duration_seconds, created_at, updated_at)
- screenshots (id, session_id, test_path, filename, data BLOB, created_at)
- templates (id, name, description, content TEXT, created_at)

**Booleans:** write `? 1 : 0`, read `=== 1`  
**JSON:** `JSON.stringify()` write, `JSON.parse()` with try-catch read

## Code Rules

**Frontend:**
- API via `api.ts` only — no `fetch` in components
- Zustand for state — never direct `api.*` in components
- CSS modules OR scoped CSS — design system in `/src/styles/variables.css`
- Errors → local state → inline display
- All text via `t('key')` — no hardcoded strings

**Backend:**
- Interface for every request/response/DB row
- Return `Type | undefined` — never `unknown`
- Errors: `reply.status(N).send({ error: '...' })`
- Auto-save: debounced upsert, update progress counters
- All responses via `request.t('key')` — no hardcoded strings
- TypeScript ES Modules: imports MUST use `.js` extension
  - Example: `import { foo } from './bar.js'` ← correct (not `.ts`)

## Auto-Save

localStorage (instant) + backend (debounced 500ms) — never lose data  
Show indicator: "Saving..." → "Saved"

## Export

- **MD:** rebuild with results filled in + summary
- **HTML:** template literals, self-contained (inline CSS)
- **JSON:** structured data
- **NO PDF**

## UI/UX Rules

**Notifications:**
- Toast system for all feedback (success/error/info/warning)
- Position: top-right, auto-dismiss after 3-5 seconds
- Never use browser alerts (`window.alert`, `window.confirm`, `window.prompt`)

**Confirmation Dialogs:**
- Modal dialogs for destructive actions (delete session, delete template, discard changes)
- Must have: Clear title, description, Cancel (secondary) + Confirm (danger) buttons
- Block background interaction while open

**Critical Actions requiring confirmation:**
- Delete session
- Delete template
- Discard unsaved changes
- Logout (if unsaved changes exist)

## i18n (Internationalization)

**Stack:**
- Backend: i18next + i18next-http-middleware + i18next-fs-backend
- Frontend: react-i18next + i18next-browser-languagedetector + i18next-http-backend

**Languages:**
- Default: German (de)
- Available: German (de), English (en)
- Fallback: English (en)

**Translation Files:**
backend/locales/
de/
common.json
errors.json
validation.json
en/
common.json
errors.json
validation.json
frontend/public/locales/
de/
common.json
ui.json
en/
common.json
ui.json

**Backend:**
- Language detection: Accept-Language header
- User preference stored in database (users.language column)
- Request decoration: `request.i18n.t('key')` or `request.t('key')`
- All error messages, validation errors, API responses via i18n

**Frontend:**
- Language detection: User preference (DB) → localStorage → browser settings
- Hook: `const { t } = useTranslation()`
- Language selector in Settings
- Persist language change to backend

**First-Run Setup:**
- Language selection during user creation (Step 1: Language → Step 2: Username/Password)
- Selected language saved to user.language column
- All subsequent requests use user's preferred language

**Critical Rules:**
- NEVER hardcode text in any file (backend or frontend)
- All UI text, error messages, validation messages via t('key')
- All new text must have translations in both de and en
- Missing translations fall back to English

## Templates

Predefined: Backend API, Frontend UI, Security Audit, Performance, Unraid Container

## Critical Gotchas

- Node.js 24 in Dockerfile + package.json engines
- better-sqlite3 booleans: write `? 1 : 0`, read `=== 1`
- Markdown parsing: handle malformed gracefully
- Auto-save: debounce + optimistic UI + upsert
- localStorage: ~5MB limit
- JWT: 24h expiry
- File upload: validate .md only
- TypeScript ES Modules: imports MUST use `.js` extension (not `.ts`)
  - `import { foo } from './bar.js'` ← TypeScript resolves to .ts, Node.js needs .js
- i18n: NEVER hardcode text — all strings via t('key')

## Dev

Claude Code on Windows/PowerShell — NO local Docker builds  
Git: commit after changes, imperative <72 chars, scope prefix  
Forbidden: unsolicited tests/refactoring