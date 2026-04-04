<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Usage

**HELDEVTEST Usage Guide**

[🏠 Home](../README.md) | [📘 Documentation](README.en.md) | [🇩🇪 Deutsch](usage.de.md)

</div>

---

## 📚 Table of Contents

- [First-Run Setup](#first-run-setup)
- [Upload Test](#upload-test)
- [Execute Tests](#execute-tests)
- [Auto-Save](#auto-save)
- [Export](#export)
- [Templates](#templates)
- [Manage Sessions](#manage-sessions)
- [Change Language](#change-language)

---

## 🚀 First-Run Setup

On first access to HELDEVTEST, the setup wizard appears (2 steps):

### Step 1: Select Language

- Choose **German** (default) or **English**
- The selected language is used for all UI elements
- Can be changed anytime in settings

### Step 2: Create User

- Enter **username** (min. 3 characters)
- Set **password** (min. 8 characters)
- **Confirm password**
- Click **"Complete Setup"**

After setup you are automatically logged in and redirected to the dashboard.

> **Note:** There is only one user. Password recovery is only possible via direct database access.

---

## 📝 Upload Test

### Test Plan Format

HELDEVTEST expects Markdown files (`.md`) with a structured hierarchy:

```markdown
# Main Category (H1)

## Sub Category (H2)

### Test Group (H3)

- [ ] **Test 1:** Description of the test
- [ ] **Test 2:** Another test
```

**Supported structure:**
- `# H1` → Main section
- `## H2` → Sub section
- `### H3` → Test group
- `- [ ]` or `- [ ] **Name:**` → Individual test

### Upload Steps

1. Open Dashboard
2. Click **"Upload Test"** button
3. Select `.md` file (max. 5MB)
4. HELDEVTEST automatically parses the structure
5. Test session is created and opened

### Example Test Plan

```markdown
# Backend API Testing v1.0

## 1. Authentication

### 1.1 Login

- [ ] **Test 1.1.1:** Successful login with valid credentials
- [ ] **Test 1.1.2:** Login fails with wrong password
- [ ] **Test 1.1.3:** Login fails with empty username

### 1.2 Logout

- [ ] **Test 1.2.1:** Successful logout
- [ ] **Test 1.2.2:** JWT token is invalid after logout

## 2. User Management

### 2.1 Profile

- [ ] **Test 2.1.1:** Retrieve user profile
- [ ] **Test 2.1.2:** Change password
```

---

## ✅ Execute Tests

### Set Test Status

For each test you can set one of three statuses:

| Status | Symbol | Meaning |
|--------|--------|---------|
| **Pass** | ✓ green | Test successful |
| **Fail** | ✗ red | Test failed |
| **Skip** | ⊘ gray | Test not executed |

Click the corresponding button next to the test.

### Bug Documentation

For failed tests:
1. Enter bug description in the text field
2. Include as many details as needed (error message, reproduction steps, etc.)
3. Saved automatically

### Record Test Duration

- Enter duration in **seconds**
- Optional – can be left empty
- Helps with performance analysis of test execution

### Progress Overview

At the top of the test page you see in real-time:

| Display | Description |
|---------|-------------|
| **Total** | Number of all tests |
| **Completed** | Processed (Pass + Fail + Skip) |
| **Passed** | Tests with status "Pass" |
| **Failed** | Tests with status "Fail" |
| **Skipped** | Tests with status "Skip" |
| **Progress bar** | Visual percentage |

---

## 💾 Auto-Save

HELDEVTEST saves your work on two levels:

### Level 1: localStorage (instant)

- Every change is saved **immediately** in browser storage
- No network delay
- Works even during brief server outages
- Limit: ~5MB (sufficient for normal test plans)

### Level 2: Backend (500ms debounced)

- After 500ms without further changes → automatic backend save
- On further change: timer resets
- SQLite UPSERT: creates or updates entries
- Progress counters are calculated automatically

### Save Indicator

In the top bar you see:
- **"Saving..."** → Backend save in progress
- **"Saved"** → Everything saved
- No indicator → No unsaved changes

> **Data loss protection:** Even after a browser crash, data is preserved in localStorage and restored on next open.

---

## 📊 Export

### Export Formats

#### Markdown (.md)

```markdown
# Backend API Testing v1.0
**Date:** 2026-04-04
**Status:** ✓ Completed

## Summary
- Total: 10
- Passed: 8 (80%)
- Failed: 1 (10%)
- Skipped: 1 (10%)

## 1. Authentication

### 1.1 Login

- [x] **Test 1.1.1:** Successful login ✓ PASSED (2s)
- [x] **Test 1.1.2:** Login with wrong password ✗ FAILED (1s)
  - **Bug:** HTTP 500 returned instead of 401
```

#### HTML (.html)

- Self-contained (no internet needed to open)
- Embedded CSS with professional design
- Color highlighting (green/red/gray)
- Print-friendly

#### JSON (.json)

```json
{
  "session": {
    "id": 1,
    "name": "Backend API Testing v1.0",
    "created_at": "2026-04-04T10:00:00Z",
    "status": "completed"
  },
  "summary": {
    "total": 10,
    "passed": 8,
    "failed": 1,
    "skipped": 1
  },
  "results": [...]
}
```

### Perform Export

1. Open test session
2. Click **"Export"** button
3. Choose format: **MD** / **HTML** / **JSON**
4. Download starts automatically

---

## 📋 Templates

### Available Templates

| Template | Description |
|----------|-------------|
| **Backend API** | REST API Endpoints, Auth, CRUD, Error Handling |
| **Frontend UI** | Components, Navigation, Forms, Responsive |
| **Security Audit** | OWASP Top 10, Auth, Input Validation, Headers |
| **Performance** | Load Times, Response Times, Database Queries |
| **Unraid Container** | Install, WebUI, Networking, Storage, Updates |

### Use a Template

1. Open Dashboard
2. Click **"From Template"** button
3. Select template
4. Optionally adjust session name
5. Click **"Create"**

### Save Custom Template

1. Open test session with desired structure
2. Click **"Save as Template"**
3. Enter name and description
4. **"Save"** – template is now available

---

## 🗂️ Manage Sessions

### Session Overview (Dashboard)

The dashboard shows all test sessions:
- **Name** of the session (filename on upload)
- **Status** (Running / Completed)
- **Progress** (x/y tests completed)
- **Date** (Created / Last modified)

### Open Session

Click on the session card or name.

### Delete Session

1. Session card → **"Delete"** (trash icon)
2. Confirmation dialog appears
3. Click **"Confirm Delete"**

> **Caution:** Deletion is permanent and cannot be undone.

### Rename Session

1. Open session
2. Click session name (in header)
3. Enter new name
4. Press Enter or click outside to save

---

## 🌍 Change Language

### Via Settings

1. Open **Settings** (gear icon)
2. Select **"Language"**
3. Choose **German** or **English**
4. Page reloads with new language

### During First-Run Setup

Language can be selected during initial setup (Step 1).

### Persistence

- Language setting is saved in the database
- Persists across browser sessions
- Restored on each login

<div align="center">

[⬆ Back to top](#usage)

</div>
