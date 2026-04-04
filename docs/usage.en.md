<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Usage

**HELDEVTEST Usage Guide**

[🏠 Home](../README.md) | [📘 Documentation](README.en.md) | [🇩🇪 Deutsch](usage.de.md)

</div>

---

## 📚 Table of Contents

- [First-Run Setup](#first-run-setup)
- [Upload Test Plan](#upload-test-plan)
- [MD Builder](#md-builder)
- [Execute Tests](#execute-tests)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Quick Actions & Bulk](#quick-actions--bulk)
- [Bug Templates](#bug-templates)
- [Auto-Save](#auto-save)
- [Export](#export)
- [Templates](#templates)
- [Manage Sessions](#manage-sessions)
- [Settings](#settings)

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

## 📝 Upload Test Plan

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
2. Drag & Drop a `.md` file onto the upload area, or click **"Upload Test"**
3. If HELDEVTEST detects structural issues, the **Import Wizard** opens
4. Select a resolution strategy for each problem (Skip / Import Empty / Convert to Freetext)
5. Session is created and opened

### Import Wizard

The Import Wizard automatically detects problems in your Markdown file and offers three resolution strategies per issue:

| Strategy | Description |
|----------|-------------|
| **Skip** | Ignore the problematic section entirely |
| **Import Empty** | Include the section without any tests |
| **Convert to Freetext** | Turn the section into a free-text note field |

---

## 🛠️ MD Builder

Create test plans from scratch without writing Markdown manually.

### Steps

1. Open **"MD Builder"** from the navigation
2. Click **"Add Section"** → Section Wizard opens
3. Enter a **title** and choose **type** (Test Checklist or Freetext Note)
4. Add tests to Test sections, or write notes in Freetext sections
5. Reorder sections with the Up/Down arrows (drag & drop)
6. Preview the generated Markdown in the **Live Preview** panel
7. Click **"Download"** to save as `.md`, or **"Save as Template"**

### Section Types

| Type | Description |
|------|-------------|
| **Test Checklist** | Standard checklist with Pass/Fail/Skip tests |
| **Freetext Note** | Free-text field for notes, context, or instructions |

---

## ✅ Execute Tests

### Set Test Status

For each test you can set one of three statuses:

| Status | Symbol | Meaning |
|--------|--------|---------|
| **Pass** | ✓ green | Test successful |
| **Fail** | ✗ red | Test failed |
| **Skip** | ⊘ gray | Test not executed |

Click the corresponding button next to the test, or use keyboard shortcuts.

### Bug Documentation

For failed tests:
1. Set status to **Fail**
2. Optionally select a **Bug Template** from the dropdown
3. Fill in the pre-populated template or write a custom description
4. Saved automatically

### Record Test Duration

- Click the **Timer** button to start/stop the timer, or enter seconds manually
- Optional — can be left empty

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

### Filter & Search

- **Search bar** (`/` to focus): Filter tests by name (300ms debounce)
- **Status filter:** Show only pending / pass / fail / skip tests

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Next unfinished test |
| `p` | Previous test |
| `1` | Mark current test as Pass |
| `2` | Mark current test as Fail |
| `3` | Mark current test as Skip |
| `s` | Save manually |
| `/` | Focus search bar |
| `Esc` | Close open dialog |
| `Ctrl+E` | Open export menu |
| `Ctrl+A` | Select all tests (Bulk Mode) |
| `Ctrl+D` | Deselect all tests |

---

## 🖱️ Quick Actions & Bulk

### Right-Click Context Menu

Right-click any test to open the Quick Actions menu:

- Copy test name
- Mark as Pass / Fail / Skip
- Start / stop timer

### Bulk Actions

1. Press `Ctrl+A` or activate **Bulk Mode**
2. Select individual tests by clicking their checkboxes
3. Use the bulk action bar to mark all selected tests as Pass / Fail / Skip
4. Press `Ctrl+D` to deselect all

---

## 🐛 Bug Templates

When a test fails, you can use pre-filled bug templates to speed up documentation.

### Available Templates

| Template | Fields |
|----------|--------|
| **Default** | Steps to Reproduce / Expected / Actual |
| **Crash / Error** | Error Message / Stack Trace / Steps |
| **Visual Bug** | Browser / Screenshot / Description |

### Usage

1. Set test status to **Fail**
2. Select a template from the **Bug Template** dropdown
3. The template is loaded into the text area
4. Fill in the details and save

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
**Date:** 2026-04-05
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
    "created_at": "2026-04-05T10:00:00Z",
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
2. Click **"Export"** button or press `Ctrl+E`
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

1. Open test session with desired structure, or build one in the MD Builder
2. Click **"Save as Template"**
3. Enter name and description
4. **"Save"** – template is now available

---

## 🗂️ Manage Sessions

### Session Overview (Dashboard)

The dashboard shows all test sessions:
- **Name** of the session
- **Status** (Running / Completed / Archived)
- **Progress** (x/y tests completed)
- **Date** (Created / Last modified)

### Open Session

Click on the session card.

### Clone Session

1. Session card → **Clone** (copy icon)
2. A new session is created with the same structure but no results
3. Useful for regression tests on new software versions

### Archive Session

1. Session card → **Archive** button
2. Session is hidden from the main list
3. Enable **"Show Archived"** filter to see archived sessions
4. Archive can be undone with the **Unarchive** button

### Delete Session

1. Session card → **"Delete"** (trash icon)
2. Confirmation dialog appears
3. Click **"Confirm Delete"**

> **Caution:** Deletion is permanent and cannot be undone.

### Rename Session

1. Open session
2. Click the session name in the header
3. Enter a new name
4. Press Enter or click outside to save

---

## ⚙️ Settings

### Language

1. Open **Settings** (gear icon)
2. Select **"Language"**
3. Choose **German** or **English**
4. Page reloads with new language

### Dark Mode

Toggle the **theme switcher** in the header to switch between light and dark mode. The preference is saved in localStorage.

### Accent Color

Open **Settings** → **Accent Color** to customize the application's accent color.

### Database Backup

1. Open **Settings**
2. Click **"Download Backup"**
3. The SQLite `.db` file is downloaded — store it safely

<div align="center">

[⬆ Back to top](#usage)

</div>
