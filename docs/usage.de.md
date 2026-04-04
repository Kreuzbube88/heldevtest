<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Verwendung

**HELDEVTEST Nutzungsanleitung**

[🏠 Hauptseite](../README.md) | [📘 Dokumentation](README.de.md) | [🇬🇧 English](usage.en.md)

</div>

---

## 📚 Inhaltsverzeichnis

- [First-Run Setup](#first-run-setup)
- [Testplan hochladen](#testplan-hochladen)
- [MD Builder](#md-builder)
- [Tests ausführen](#tests-ausführen)
- [Tastaturkürzel](#tastaturkürzel)
- [Quick Actions & Bulk](#quick-actions--bulk)
- [Bug Templates](#bug-templates)
- [Auto-Save](#auto-save)
- [Export](#export)
- [Templates](#templates)
- [Sessions verwalten](#sessions-verwalten)
- [Einstellungen](#einstellungen)

---

## 🚀 First-Run Setup

Beim ersten Zugriff auf HELDEVTEST erscheint der Setup-Assistent (2 Schritte):

### Schritt 1: Sprache wählen

- **Deutsch** (Standard) oder **Englisch** auswählen
- Die gewählte Sprache gilt für alle UI-Elemente
- Jederzeit in den Einstellungen änderbar

### Schritt 2: Benutzer anlegen

- **Benutzername** eingeben (mind. 3 Zeichen)
- **Passwort** setzen (mind. 8 Zeichen)
- **Passwort bestätigen**
- Auf **"Setup abschließen"** klicken

Nach dem Setup wird automatisch eingeloggt und zum Dashboard weitergeleitet.

> **Hinweis:** Es gibt nur einen Benutzer. Passwort-Wiederherstellung ist nur über direkten Datenbankzugriff möglich.

---

## 📝 Testplan hochladen

### Testplan-Format

HELDEVTEST erwartet Markdown-Dateien (`.md`) mit einer strukturierten Hierarchie:

```markdown
# Hauptkategorie (H1)

## Unterkategorie (H2)

### Testgruppe (H3)

- [ ] **Test 1:** Beschreibung des Tests
- [ ] **Test 2:** Weiterer Test
```

**Unterstützte Struktur:**
- `# H1` → Hauptabschnitt
- `## H2` → Unterabschnitt
- `### H3` → Testgruppe
- `- [ ]` oder `- [ ] **Name:**` → Einzelner Test

### Upload-Schritte

1. Dashboard öffnen
2. `.md` Datei per Drag & Drop in den Upload-Bereich ziehen, oder **"Test hochladen"** klicken
3. Falls HELDEVTEST strukturelle Probleme erkennt, öffnet sich der **Import Wizard**
4. Für jedes Problem eine Lösungsstrategie wählen (Skip / Import Empty / Convert to Freetext)
5. Session wird erstellt und geöffnet

### Import Wizard

Der Import Wizard erkennt automatisch Probleme in der Markdown-Datei und bietet drei Lösungsstrategien:

| Strategie | Beschreibung |
|-----------|-------------|
| **Skip** | Problematische Section ignorieren |
| **Import Empty** | Section ohne Tests einfügen |
| **Convert to Freetext** | Section in Freitext-Notizfeld umwandeln |

---

## 🛠️ MD Builder

Testpläne von Grund auf erstellen ohne Markdown manuell zu schreiben.

### Schritte

1. **"MD Builder"** in der Navigation öffnen
2. **"Section hinzufügen"** klicken → Section Wizard öffnet sich
3. **Titel** eingeben und **Typ** wählen (Test-Checkliste oder Freitext-Notiz)
4. Tests zu Test-Sections hinzufügen, oder Notizen in Freitext-Sections schreiben
5. Sections mit den Pfeil-Schaltflächen umsortieren (Drag & Drop)
6. Das generierte Markdown in der **Live-Vorschau** prüfen
7. **"Herunterladen"** zum Speichern als `.md`, oder **"Als Vorlage speichern"**

### Section-Typen

| Typ | Beschreibung |
|-----|-------------|
| **Test-Checkliste** | Standard-Checkliste mit Pass/Fail/Skip Tests |
| **Freitext-Notiz** | Freitextfeld für Notizen, Kontext oder Anweisungen |

---

## ✅ Tests ausführen

### Test-Status setzen

Für jeden Test kann einer von drei Status gesetzt werden:

| Status | Symbol | Bedeutung |
|--------|--------|-----------|
| **Pass** | ✓ grün | Test erfolgreich |
| **Fail** | ✗ rot | Test fehlgeschlagen |
| **Skip** | ⊘ grau | Test nicht ausgeführt |

Auf die entsprechende Schaltfläche neben dem Test klicken, oder Tastaturkürzel verwenden.

### Bug-Dokumentation

Bei fehlgeschlagenen Tests:
1. Status auf **Fail** setzen
2. Optional ein **Bug-Template** aus dem Dropdown wählen
3. Vorgefülltes Template anpassen oder eigene Beschreibung schreiben
4. Wird automatisch gespeichert

### Testdauer erfassen

- **Timer**-Schaltfläche klicken zum Starten/Stoppen, oder Sekunden manuell eingeben
- Optional — kann leer gelassen werden

### Fortschritts-Übersicht

Oben auf der Testseite in Echtzeit sichtbar:

| Anzeige | Bedeutung |
|---------|-----------|
| **Gesamt** | Anzahl aller Tests |
| **Abgeschlossen** | Bearbeitet (Pass + Fail + Skip) |
| **Bestanden** | Tests mit Status "Pass" |
| **Fehlgeschlagen** | Tests mit Status "Fail" |
| **Übersprungen** | Tests mit Status "Skip" |
| **Fortschrittsbalken** | Visueller Prozentwert |

### Filter & Suche

- **Suchleiste** (`/` zum Fokussieren): Tests nach Name filtern (300ms Debounce)
- **Status-Filter:** Nur ausstehende / pass / fail / skip Tests anzeigen

---

## ⌨️ Tastaturkürzel

| Taste | Aktion |
|-------|--------|
| `n` | Nächster unfertige Test |
| `p` | Vorheriger Test |
| `1` | Aktuellen Test als Bestanden markieren |
| `2` | Aktuellen Test als Fehlgeschlagen markieren |
| `3` | Aktuellen Test als Übersprungen markieren |
| `s` | Manuell speichern |
| `/` | Suchleiste fokussieren |
| `Esc` | Offenen Dialog schließen |
| `Ctrl+E` | Export-Menü öffnen |
| `Ctrl+A` | Alle Tests auswählen (Bulk Mode) |
| `Ctrl+D` | Auswahl aufheben |

---

## 🖱️ Quick Actions & Bulk

### Rechtsklick-Kontextmenü

Rechtsklick auf einen Test öffnet das Quick Actions-Menü:

- Testname kopieren
- Als Pass / Fail / Skip markieren
- Timer starten / stoppen

### Bulk Actions

1. `Ctrl+A` drücken oder **Bulk Mode** aktivieren
2. Einzelne Tests per Checkbox auswählen
3. In der Bulk-Aktionsleiste alle ausgewählten Tests als Pass / Fail / Skip markieren
4. `Ctrl+D` drücken zum Abwählen aller Tests

---

## 🐛 Bug Templates

Bei fehlgeschlagenen Tests können vorgefertigte Bug-Templates die Dokumentation beschleunigen.

### Verfügbare Templates

| Template | Felder |
|----------|--------|
| **Standard** | Schritte zur Reproduktion / Erwartet / Tatsächlich |
| **Crash / Fehler** | Fehlermeldung / Stack Trace / Schritte |
| **Visueller Bug** | Browser / Screenshot / Beschreibung |

### Verwendung

1. Test-Status auf **Fail** setzen
2. Template aus dem **Bug-Template** Dropdown auswählen
3. Template wird in das Textfeld geladen
4. Details ausfüllen und speichern

---

## 💾 Auto-Save

HELDEVTEST speichert die Arbeit auf zwei Ebenen:

### Ebene 1: localStorage (sofort)

- Jede Änderung wird **sofort** im Browser-Speicher gespeichert
- Kein Netzwerk-Delay
- Funktioniert auch bei kurzen Server-Ausfällen
- Limit: ~5MB (ausreichend für normale Testpläne)

### Ebene 2: Backend (500ms Debounce)

- Nach 500ms ohne weitere Änderungen → automatische Backend-Speicherung
- Bei weiterer Änderung: Timer wird zurückgesetzt
- SQLite UPSERT: erstellt oder aktualisiert Einträge
- Fortschritts-Zähler werden automatisch berechnet

### Speicher-Indikator

In der oberen Leiste erscheint:
- **"Speichert..."** → Backend-Speicherung läuft
- **"Gespeichert"** → Alles gespeichert
- Kein Indikator → Keine ungespeicherten Änderungen

> **Datenverlust-Schutz:** Selbst nach einem Browser-Absturz sind die Daten in localStorage erhalten und werden beim nächsten Öffnen wiederhergestellt.

---

## 📊 Export

### Export-Formate

#### Markdown (.md)

```markdown
# Backend API Testing v1.0
**Datum:** 2026-04-05
**Status:** ✓ Abgeschlossen

## Zusammenfassung
- Gesamt: 10
- Bestanden: 8 (80%)
- Fehlgeschlagen: 1 (10%)
- Übersprungen: 1 (10%)

## 1. Authentifizierung

### 1.1 Login

- [x] **Test 1.1.1:** Erfolgreicher Login ✓ BESTANDEN (2s)
- [x] **Test 1.1.2:** Login mit falschem Passwort ✗ FEHLGESCHLAGEN (1s)
  - **Bug:** HTTP 500 statt 401 zurückgegeben
```

#### HTML (.html)

- Self-contained (kein Internet zum Öffnen benötigt)
- Eingebettetes CSS mit professionellem Design
- Farbliche Hervorhebung (grün/rot/grau)
- Druckfreundlich

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

### Export durchführen

1. Test-Session öffnen
2. **"Export"**-Schaltfläche klicken oder `Ctrl+E` drücken
3. Format wählen: **MD** / **HTML** / **JSON**
4. Download startet automatisch

---

## 📋 Templates

### Verfügbare Templates

| Template | Beschreibung |
|----------|-------------|
| **Backend API** | REST API Endpoints, Auth, CRUD, Fehlerbehandlung |
| **Frontend UI** | Komponenten, Navigation, Formulare, Responsive |
| **Security Audit** | OWASP Top 10, Auth, Input Validation, Headers |
| **Performance** | Ladezeiten, Antwortzeiten, Datenbankabfragen |
| **Unraid Container** | Installation, WebUI, Netzwerk, Storage, Updates |

### Template verwenden

1. Dashboard öffnen
2. **"Aus Vorlage"**-Schaltfläche klicken
3. Template auswählen
4. Optional Session-Name anpassen
5. **"Erstellen"** klicken

### Eigenes Template speichern

1. Test-Session mit gewünschter Struktur öffnen, oder im MD Builder erstellen
2. **"Als Vorlage speichern"** klicken
3. Name und Beschreibung eingeben
4. **"Speichern"** – Vorlage ist nun verfügbar

---

## 🗂️ Sessions verwalten

### Session-Übersicht (Dashboard)

Das Dashboard zeigt alle Test-Sessions:
- **Name** der Session
- **Status** (Laufend / Abgeschlossen / Archiviert)
- **Fortschritt** (x/y Tests abgeschlossen)
- **Datum** (Erstellt / Zuletzt geändert)

### Session öffnen

Auf die Session-Karte klicken.

### Session klonen

1. Session-Karte → **Klonen** (Kopier-Symbol)
2. Eine neue Session wird mit derselben Struktur, aber ohne Ergebnisse erstellt
3. Nützlich für Regressionstests bei neuen Software-Versionen

### Session archivieren

1. Session-Karte → **Archivieren**-Schaltfläche
2. Session wird aus der Hauptliste ausgeblendet
3. **"Archivierte anzeigen"**-Filter aktivieren, um archivierte Sessions zu sehen
4. Archivierung kann mit **Dearchivieren** rückgängig gemacht werden

### Session löschen

1. Session-Karte → **"Löschen"** (Papierkorb-Symbol)
2. Bestätigungs-Dialog erscheint
3. **"Löschen bestätigen"** klicken

> **Achtung:** Das Löschen ist dauerhaft und kann nicht rückgängig gemacht werden.

### Session umbenennen

1. Session öffnen
2. Session-Namen in der Kopfzeile anklicken
3. Neuen Namen eingeben
4. Enter drücken oder außerhalb klicken zum Speichern

---

## ⚙️ Einstellungen

### Sprache

1. **Einstellungen** öffnen (Zahnrad-Symbol)
2. **"Sprache"** auswählen
3. **Deutsch** oder **Englisch** wählen
4. Seite lädt mit neuer Sprache

### Dark Mode

Den **Theme-Umschalter** in der Kopfzeile klicken, um zwischen hellem und dunklem Modus zu wechseln. Die Einstellung wird in localStorage gespeichert.

### Akzentfarbe

**Einstellungen** → **Akzentfarbe** öffnen, um die Akzentfarbe der Anwendung anzupassen.

### Datenbank-Backup

1. **Einstellungen** öffnen
2. **"Backup herunterladen"** klicken
3. Die SQLite `.db` Datei wird heruntergeladen — sicher aufbewahren

<div align="center">

[⬆ Nach oben](#verwendung)

</div>
