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

#### ✅ Interaktive Test-Ausführung

- **Status-Tracking:** Markieren Sie jeden Test als ✓ Bestanden / ✗ Fehlgeschlagen / ⊘ Übersprungen
- **Bug-Dokumentation:** Erfassen Sie Fehler direkt beim Test mit Freitextfeldern
- **Zeit-Messung:** Dokumentieren Sie die Testdauer in Sekunden
- **Echtzeit-Fortschritt:** Sehen Sie sofort, wie viele Tests abgeschlossen/bestanden/fehlgeschlagen sind

#### 💾 Intelligentes Auto-Save

Ihre Arbeit ist immer geschützt:
- **Sofort:** Änderungen werden sofort im Browser (localStorage) gespeichert
- **Debounced Backend:** Nach 500ms werden Änderungen automatisch im Backend persistiert
- **Optimistic UI:** Die Oberfläche reagiert sofort, ohne auf Server-Antworten zu warten
- **Indikator:** Status "Speichert..." → "Gespeichert" zeigt den Speichervorgang an

#### 📊 Flexible Export-Optionen

| Format | Beschreibung | Ideal für |
|--------|-------------|-----------|
| **Markdown (.md)** | Rekonstruierter Testplan mit ausgefüllten Ergebnissen + Zusammenfassung | Versionskontrolle (Git) |
| **HTML (.html)** | Self-contained Report mit eingebettetem CSS, professionelles Design | Stakeholder-Berichte |
| **JSON (.json)** | Strukturierte Daten mit allen Test-Metadaten | CI/CD-Integration, Automatisierung |

#### 📋 Template-System

5 vorgefertigte Templates zum Schnellstart:

| Template | Inhalt |
|----------|--------|
| **Backend API Testing** | REST API Endpoints, Authentication, CRUD Operations |
| **Frontend UI Testing** | Komponenten, User Flows, Responsive Design |
| **Security Audit** | Penetration Tests, Vulnerability Scans, OWASP |
| **Performance Testing** | Load Tests, Response Times, Bottlenecks |
| **Unraid Container Testing** | Docker, Networking, Storage, WebUI |

#### 🌍 Mehrsprachigkeit (i18n)

Vollständig zweisprachig:
- **Deutsch** (Standard)
- **Englisch**

Sprachauswahl bei First-Run Setup oder jederzeit in den Einstellungen. Alle UI-Elemente, Fehlermeldungen und Validierungen sind übersetzt.

#### 🔐 Sicheres Single-User System

- **First-Run Setup:** Beim ersten Start Sprache wählen + Benutzer anlegen
- **JWT Authentication:** Sichere Token-basierte Authentifizierung (24h Gültigkeit)
- **bcrypt Hashing:** Passwörter werden mit bcrypt (12 Runden) gehasht

---

## 🏗️ Architektur

### System-Übersicht

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

### Datenfluss

1. **Upload:** `.md` Datei → Fastify → Markdown Parser → JSON Struktur → SQLite
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
| **react-i18next** | De-facto Standard für React i18n |

---

## ❓ FAQ

**Q: Kann ich mehrere Benutzer anlegen?**  
A: Nein, HELDEVTEST ist bewusst als Single-User-System konzipiert. Für Team-Nutzung empfehlen wir separate Instanzen pro Tester.

**Q: Werden meine Daten in der Cloud gespeichert?**  
A: Nein, alle Daten bleiben lokal auf Ihrem Server/Container. Es gibt keine externen Verbindungen.

**Q: Kann ich eigene Templates erstellen?**  
A: Ja, Templates können aus erfolgreichen Sessions über das Template-Menü gespeichert werden.

**Q: Ist HELDEVTEST mobilfreundlich?**  
A: Nein, bewusst Desktop-only. Test-Ausführung erfordert einen größeren Bildschirm.

**Q: Wie funktioniert die Auto-Save Logik?**  
A: Änderungen → localStorage (instant) → 500ms Timer startet → Bei erneutem Change wird Timer resettet → Nach 500ms Ruhe → Backend UPSERT.

**Q: Kann ich die SQLite-Datenbank extern abfragen?**  
A: Ja, die DB liegt unter `/app/data/heldevtest.db` im Container. Sie können sie mit jedem SQLite-Client öffnen.

---

## 🔗 Weiterführende Dokumentation

- [⚙️ Installation](installation.de.md)
- [🎓 Verwendung](usage.de.md)
- [🚀 Deployment](deployment.de.md)

<div align="center">

[⬆ Nach oben](#heldevtest-dokumentation)

</div>
