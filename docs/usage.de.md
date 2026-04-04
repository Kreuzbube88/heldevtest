<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Verwendung

**HELDEVTEST Nutzungsanleitung**

[🏠 Hauptseite](../README.md) | [📘 Dokumentation](README.de.md) | [🇬🇧 English](usage.en.md)

</div>

---

## 📚 Inhaltsverzeichnis

- [First-Run Setup](#first-run-setup)
- [Test hochladen](#test-hochladen)
- [Test ausführen](#test-ausführen)
- [Auto-Save](#auto-save)
- [Export](#export)
- [Templates](#templates)
- [Sessions verwalten](#sessions-verwalten)
- [Sprache wechseln](#sprache-wechseln)

---

## 🚀 First-Run Setup

Beim ersten Zugriff auf HELDEVTEST erscheint der Setup-Assistent (2 Schritte):

### Schritt 1: Sprache wählen

- **Deutsch** (Standard) oder **Englisch** auswählen
- Die gewählte Sprache wird für alle UI-Elemente verwendet
- Kann jederzeit in den Einstellungen geändert werden

### Schritt 2: Benutzer anlegen

- **Benutzername** eingeben (min. 3 Zeichen)
- **Passwort** festlegen (min. 8 Zeichen)
- **Passwort bestätigen**
- **"Setup abschließen"** klicken

Nach dem Setup werden Sie automatisch eingeloggt und zum Dashboard weitergeleitet.

> **Hinweis:** Es gibt nur einen Benutzer. Passwort-Wiederherstellung ist nur über Datenbankzugriff möglich.

---

## 📝 Test hochladen

### Testplan-Format

HELDEVTEST erwartet Markdown-Dateien (`.md`) mit einer strukturierten Hierarchie:

```markdown
# Hauptkategorie (H1)

## Unterkategorie (H2)

### Test-Gruppe (H3)

- [ ] **Test 1:** Beschreibung des Tests
- [ ] **Test 2:** Weiterer Test
```

**Unterstützte Struktur:**
- `# H1` → Haupt-Abschnitt
- `## H2` → Unter-Abschnitt
- `### H3` → Test-Gruppe
- `- [ ]` oder `- [ ] **Name:**` → Einzelner Test

### Upload-Schritte

1. Dashboard öffnen
2. **"Test hochladen"** Button klicken
3. `.md` Datei auswählen (max. 5MB)
4. HELDEVTEST parst die Struktur automatisch
5. Test-Session wird erstellt und geöffnet

### Beispiel-Testplan

```markdown
# Backend API Testing v1.0

## 1. Authentication

### 1.1 Login

- [ ] **Test 1.1.1:** Erfolgreicher Login mit gültigen Daten
- [ ] **Test 1.1.2:** Login schlägt bei falschem Passwort fehl
- [ ] **Test 1.1.3:** Login schlägt bei leerem Benutzernamen fehl

### 1.2 Logout

- [ ] **Test 1.2.1:** Erfolgreicher Logout
- [ ] **Test 1.2.2:** JWT Token ist nach Logout ungültig

## 2. User Management

### 2.1 Profile

- [ ] **Test 2.1.1:** Benutzerprofil abrufen
- [ ] **Test 2.1.2:** Passwort ändern
```

---

## ✅ Test ausführen

### Test-Status setzen

Für jeden Test können Sie einen von drei Status setzen:

| Status | Symbol | Bedeutung |
|--------|--------|-----------|
| **Bestanden** | ✓ grün | Test erfolgreich |
| **Fehlgeschlagen** | ✗ rot | Test fehlgeschlagen |
| **Übersprungen** | ⊘ grau | Test nicht ausgeführt |

Klicken Sie auf den entsprechenden Button neben dem Test.

### Bug-Dokumentation

Bei fehlgeschlagenen Tests:
1. Bug-Beschreibung in das Textfeld eingeben
2. So viele Details wie nötig angeben (Fehlermeldung, Schritte zur Reproduktion, etc.)
3. Wird automatisch gespeichert

### Testdauer erfassen

- Dauer in **Sekunden** eingeben
- Optional – kann leer gelassen werden
- Hilft bei Performance-Analyse der Testausführung

### Fortschritts-Übersicht

Oben auf der Test-Seite sehen Sie in Echtzeit:

| Anzeige | Beschreibung |
|---------|-------------|
| **Gesamt** | Anzahl aller Tests |
| **Abgeschlossen** | Bearbeitet (Pass + Fail + Skip) |
| **Bestanden** | Tests mit Status "Bestanden" |
| **Fehlgeschlagen** | Tests mit Status "Fehlgeschlagen" |
| **Übersprungen** | Tests mit Status "Übersprungen" |
| **Fortschrittsbalken** | Visueller Prozentsatz |

---

## 💾 Auto-Save

HELDEVTEST speichert Ihre Arbeit auf zwei Ebenen:

### Ebene 1: localStorage (sofort)

- Jede Änderung wird **sofort** im Browser-Speicher gesichert
- Keine Netzwerkverzögerung
- Funktioniert auch bei kurzzeitigem Server-Ausfall
- Limit: ~5MB (für normale Testpläne ausreichend)

### Ebene 2: Backend (500ms debounced)

- Nach 500ms ohne weitere Änderungen → automatischer Backend-Save
- Bei weiterer Änderung: Timer wird zurückgesetzt
- SQLite UPSERT: Erstellt oder aktualisiert Einträge
- Fortschritts-Zähler werden automatisch berechnet

### Save-Indikator

In der oberen Leiste sehen Sie:
- **"Speichert..."** → Backend-Speichervorgang läuft
- **"Gespeichert"** → Alles gesichert
- Kein Indikator → Keine ungespeicherten Änderungen

> **Datenverlust-Schutz:** Selbst bei Browser-Absturz sind Daten in localStorage erhalten und werden beim nächsten Öffnen wiederhergestellt.

---

## 📊 Export

### Export-Formate

#### Markdown (.md)

```markdown
# Backend API Testing v1.0
**Datum:** 2026-04-04
**Status:** ✓ Abgeschlossen

## Zusammenfassung
- Gesamt: 10
- Bestanden: 8 (80%)
- Fehlgeschlagen: 1 (10%)
- Übersprungen: 1 (10%)

## 1. Authentication

### 1.1 Login

- [x] **Test 1.1.1:** Erfolgreicher Login ✓ BESTANDEN (2s)
- [x] **Test 1.1.2:** Login bei falschem Passwort ✗ FEHLGESCHLAGEN (1s)
  - **Bug:** HTTP 500 statt 401 zurückgegeben
```

#### HTML (.html)

- Self-contained (kein Internet nötig zum Öffnen)
- Eingebettetes CSS mit professionellem Design
- Farbliche Hervorhebung (grün/rot/grau)
- Druckfreundlich

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

### Export durchführen

1. Test-Session öffnen
2. **"Exportieren"** Button klicken
3. Format wählen: **MD** / **HTML** / **JSON**
4. Download startet automatisch

---

## 📋 Templates

### Vorhandene Templates

| Template | Beschreibung |
|----------|-------------|
| **Backend API** | REST API Endpoints, Auth, CRUD, Error Handling |
| **Frontend UI** | Komponenten, Navigation, Formulare, Responsive |
| **Security Audit** | OWASP Top 10, Auth, Input Validation, Headers |
| **Performance** | Load Times, Response Times, Database Queries |
| **Unraid Container** | Install, WebUI, Networking, Storage, Updates |

### Template verwenden

1. Dashboard öffnen
2. **"Aus Template"** Button klicken
3. Template auswählen
4. Optional: Session-Name anpassen
5. **"Erstellen"** klicken

### Eigenes Template speichern

1. Test-Session mit gewünschter Struktur öffnen
2. **"Als Template speichern"** klicken
3. Name und Beschreibung eingeben
4. **"Speichern"** – Template ist jetzt verfügbar

---

## 🗂️ Sessions verwalten

### Session-Übersicht (Dashboard)

Das Dashboard zeigt alle Test-Sessions:
- **Name** der Session (Dateiname beim Upload)
- **Status** (Laufend / Abgeschlossen)
- **Fortschritt** (x/y Tests abgeschlossen)
- **Datum** (Erstellt / Zuletzt geändert)

### Session öffnen

Klick auf die Session-Karte oder den Namen.

### Session löschen

1. Session-Karte → **"Löschen"** (Papierkorb-Symbol)
2. Bestätigungsdialog erscheint
3. **"Löschen bestätigen"** klicken

> **Achtung:** Löschen ist permanent und kann nicht rückgängig gemacht werden.

### Session umbenennen

1. Session öffnen
2. Session-Name anklicken (im Header)
3. Neuen Namen eingeben
4. Enter oder Klick außerhalb zum Speichern

---

## 🌍 Sprache wechseln

### Über die Einstellungen

1. **Einstellungen** öffnen (Zahnrad-Symbol)
2. **"Sprache"** auswählen
3. **Deutsch** oder **Englisch** wählen
4. Seite lädt mit neuer Sprache

### Beim First-Run Setup

Die Sprache kann bei der Ersteinrichtung gewählt werden (Schritt 1).

### Persistenz

- Spracheinstellung wird in der Datenbank gespeichert
- Bleibt über Browser-Sessions hinaus erhalten
- Wird bei jedem Login wiederhergestellt

<div align="center">

[⬆ Nach oben](#verwendung)

</div>
