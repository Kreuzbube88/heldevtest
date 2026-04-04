<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="180"/>

# HELDEVTEST Dokumentation

**Vollständige deutsche Dokumentation**

[🏠 Hauptseite](../README.md) | [🇬🇧 English](README.en.md)

</div>

---

## 📚 Inhaltsverzeichnis

- [Überblick](#überblick)
- [Installation](installation.de.md)
- [Verwendung](usage.de.md)
- [Deployment](deployment.de.md)
- [Architektur](#architektur)
- [FAQ](#faq)

---

## 🎯 Überblick

HELDEVTEST ist ein modernes Web-Tool für die **interaktive Ausführung und Dokumentation von Software-Tests**. Es kombiniert die Einfachheit von Markdown mit einer leistungsstarken Test-Management-Oberfläche.

### Hauptmerkmale

#### 📝 Markdown-basierte Testpläne

Schreiben Sie Ihre Testpläne in vertrautem Markdown-Format:

```markdown
# Backend API Testing

## 1. Authentication Tests

### 1.1 Login

- [ ] **Test 1.1.1:** Successful login with valid credentials
- [ ] **Test 1.1.2:** Login fails with invalid password
```

HELDEVTEST erkennt automatisch die Struktur und erstellt eine interaktive Test-Oberfläche.

#### 🧙 Import Wizard

Beim Hochladen einer Markdown-Datei erkennt HELDEVTEST automatisch strukturelle Probleme (leere Sections, nicht unterstützte Formate). Der Import Wizard bietet drei Lösungsstrategien:

- **Skip** — problematische Sections ignorieren
- **Import Empty** — leere Sections ohne Tests einfügen
- **Convert to Freetext** — problematische Sections in Freitext-Notizfelder umwandeln

#### ✅ Interaktive Test-Ausführung

- **Status-Tracking:** Jeden Test als ✓ Bestanden / ✗ Fehlgeschlagen / ⊘ Übersprungen markieren
- **Bug-Dokumentation:** Fehler direkt beim Test erfassen mit Freitextfeldern
- **Bug-Templates:** 3 vorgefertigte Vorlagen (Standard / Crash+Fehler / Visueller Bug)
- **Zeit-Messung:** Optionaler Timer pro Test
- **Echtzeit-Fortschritt:** Gesamt / Abgeschlossen / Bestanden / Fehlgeschlagen

#### ⌨️ Tastaturkürzel

| Taste | Aktion |
|-------|--------|
| `n` | Nächster unfertige Test |
| `p` | Vorheriger Test |
| `1` | Als Bestanden markieren |
| `2` | Als Fehlgeschlagen markieren |
| `3` | Als Übersprungen markieren |
| `s` | Speichern |
| `/` | Suche fokussieren |
| `Esc` | Dialog schließen |
| `Ctrl+E` | Export-Menü |
| `Ctrl+A` | Alle Tests auswählen |
| `Ctrl+D` | Auswahl aufheben |

#### 🖱️ Quick Actions & Bulk Actions

- **Rechtsklick-Kontextmenü** pro Test: Name kopieren / Pass/Fail/Skip setzen / Timer starten
- **Bulk Actions:** Mehrere Tests auswählen → Alle als Pass/Fail/Skip markieren

#### 💾 Intelligentes Auto-Save

- **Sofort:** Änderungen werden sofort in localStorage gespeichert
- **Debounced Backend:** Nach 500ms Ruhe werden Änderungen in SQLite persistiert
- **Indikator:** "Speichert..." → "Gespeichert"

#### 📊 Flexible Export-Optionen

| Format | Beschreibung | Ideal für |
|--------|-------------|-----------|
| **Markdown (.md)** | Rekonstruierter Testplan mit Ergebnissen + Zusammenfassung | Versionskontrolle (Git) |
| **HTML (.html)** | Self-contained Report mit eingebettetem CSS | Stakeholder-Berichte |
| **JSON (.json)** | Strukturierte Daten mit allen Test-Metadaten | CI/CD-Integration |

#### 🛠️ MD Builder

Testpläne von Grund auf erstellen ohne Markdown manuell zu schreiben:

- Drag & Drop Section-Sortierung
- Section Wizard: Titel und Typ wählen (Test-Checkliste / Freitext-Notiz)
- Live-Vorschau des generierten Markdowns
- Als `.md` herunterladen oder als Vorlage speichern

#### 🗂️ Session-Verwaltung

- **Cloning:** Session-Struktur kopieren (ohne Ergebnisse) für Regressionstests
- **Archivierung:** Abgeschlossene Sessions archivieren und Dashboard aufräumen
- **Lazy Loading:** Dashboard paginiert bei 20 Sessions pro Seite
- **Filter:** Nach Status filtern, nach Name suchen

#### 📋 Template-System

5 vorgefertigte Templates zum Schnellstart:

| Template | Inhalt |
|----------|--------|
| **Backend API Testing** | REST API Endpoints, Authentication, CRUD Operations |
| **Frontend UI Testing** | Komponenten, User Flows, Responsive Design |
| **Security Audit** | OWASP Top 10, Auth, Input Validation, Headers |
| **Performance Testing** | Load Tests, Response Times, Bottlenecks |
| **Unraid Container Testing** | Docker, Networking, Storage, WebUI |

Eigene Templates können aus jeder Session gespeichert werden.

#### 🎨 UI/UX

- **Dark Mode:** Manueller Toggle, gespeichert in localStorage
- **Akzentfarbe:** Anpassbare Akzentfarbe in den Einstellungen
- **Toast-Benachrichtigungen:** Oben rechts, automatisch ausblenden nach 3–5s — keine Browser-Dialoge
- **Bestätigungs-Dialoge:** Modal für destruktive Aktionen (Löschen, Verwerfen)
- **Session Timeout Warnung:** Benachrichtigung 5 Minuten vor JWT-Ablauf
- **Virtual Scrolling:** react-window bei Sessions mit >50 Tests

#### 🔒 Sicherheit

- JWT-Authentifizierung (24h Gültigkeit)
- bcrypt Passwort-Hashing (12 Runden)
- Rate Limiting: Login 5/15min, API 20/min
- Input-Validierung: Nur `.md` Upload erlaubt
- Datenbank-Backup Download (SQLite `.db`)

#### 🌍 Mehrsprachigkeit (i18n)

- **Deutsch** (Standard)
- **Englisch**
- Sprachauswahl bei First-Run Setup oder jederzeit in den Einstellungen

---

## 🏗️ Architektur

### System-Übersicht

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

### Datenfluss

1. **Upload:** `.md` Datei → Import Wizard (bei Problemen) → Markdown Parser → JSON Struktur → SQLite
2. **Anzeige:** Frontend lädt Session → React rendert interaktive UI
3. **Ausführung:** User ändert Status/Bugs → localStorage (sofort) → Backend (500ms debounced) → SQLite UPSERT
4. **Export:** User klickt Export → Backend generiert MD/HTML/JSON → Download

### Technologie-Entscheidungen

| Entscheidung | Begründung |
|--------------|------------|
| **Node.js 24** | Neueste LTS-Version, native ESM Support |
| **TypeScript Strict** | Type Safety, bessere DX, weniger Bugs |
| **Fastify** | Schneller als Express, natives TypeScript Support |
| **better-sqlite3** | Synchron, kein Network Overhead, WAL für Concurrency |
| **Zustand** | Leichtgewichtig, kein Boilerplate, Hook-basiert |
| **Vite** | Schneller als Webpack, native ESM, HMR |
| **react-window** | Virtual Scrolling für große Test-Listen |
| **react-i18next** | De-facto Standard für React i18n |

---

## ❓ FAQ

**Q: Kann ich mehrere Benutzer anlegen?**  
A: Nein, HELDEVTEST ist bewusst als Single-User-System konzipiert. Für Team-Nutzung empfehlen wir separate Instanzen pro Tester.

**Q: Werden meine Daten in der Cloud gespeichert?**  
A: Nein, alle Daten bleiben lokal auf Ihrem Server/Container. Es gibt keine externen Verbindungen.

**Q: Kann ich eigene Templates erstellen?**  
A: Ja, Templates können aus jeder Session gespeichert werden oder im MD Builder erstellt werden.

**Q: Ist HELDEVTEST mobilfreundlich?**  
A: Nein, bewusst Desktop-only. Test-Ausführung erfordert einen größeren Bildschirm.

**Q: Wie funktioniert die Auto-Save Logik?**  
A: Änderungen → localStorage (instant) → 500ms Timer startet → Bei erneutem Change wird Timer resettet → Nach 500ms Ruhe → Backend UPSERT.

**Q: Kann ich die SQLite-Datenbank extern abfragen?**  
A: Ja, die DB liegt unter `/app/data/heldevtest.db` im Container. Sie können sie mit jedem SQLite-Client öffnen oder über Einstellungen → Backup herunterladen.

---

## 🔗 Weiterführende Dokumentation

- [⚙️ Installation](installation.de.md)
- [🎓 Verwendung](usage.de.md)
- [🚀 Deployment](deployment.de.md)

<div align="center">

[⬆ Nach oben](#heldevtest-dokumentation)

</div>
