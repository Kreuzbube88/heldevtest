<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Installation

**HELDEVTEST Installationsanleitung**

[🏠 Hauptseite](../README.md) | [📘 Dokumentation](README.de.md) | [🇬🇧 English](installation.en.md)

</div>

---

## 📦 Installationsmethoden

### 1️⃣ Docker Compose (Empfohlen)

**Voraussetzungen:** Docker 20.10+, Docker Compose 2.0+

```bash
# Repository klonen
git clone https://github.com/Kreuzbube88/heldevtest
cd heldevtest

# Container starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f
```

**Zugriff:** http://localhost:3001

**Stoppen:**
```bash
docker-compose down

# Mit Datenlöschung (Achtung!)
docker-compose down -v
```

---

### 2️⃣ Docker Run

```bash
docker run -d \
  --name heldevtest \
  --restart unless-stopped \
  -p 3001:3001 \
  -v heldevtest-data:/app/data \
  -e JWT_SECRET=your-secure-secret-min-32-chars \
  ghcr.io/kreuzbube88/heldevtest:latest
```

**Container-Management:**
```bash
docker logs -f heldevtest    # Logs
docker stop heldevtest       # Stoppen
docker start heldevtest      # Starten
docker restart heldevtest    # Neu starten
docker rm -f heldevtest      # Entfernen
```

---

### 3️⃣ Unraid Community Store

1. **Apps** Tab öffnen → **Community Applications**
2. Nach `HELDEVTEST` suchen
3. **Install** klicken
4. Port `3001` konfigurieren (oder Standard beibehalten)
5. **Apply** → Container wird gestartet
6. Zugriff: `http://UNRAID-IP:3001`

**Manuelle Template-Installation (falls nicht im Store):**
```bash
# SSH zu Unraid Server
ssh root@UNRAID-IP

# Template downloaden
wget https://raw.githubusercontent.com/Kreuzbube88/heldevtest/main/heldevtest.xml \
  -O /boot/config/plugins/dockerMan/templates-user/heldevtest.xml
```
Dann: Docker Tab → Add Container → Template: HELDEVTEST

---

### 4️⃣ Manuelle Installation (Development)

**Voraussetzungen:** Node.js 24+, npm 10+

**Backend:**
```bash
git clone https://github.com/Kreuzbube88/heldevtest
cd heldevtest/backend
npm install
npm run dev   # http://localhost:3001
```

**Frontend (separates Terminal):**
```bash
cd heldevtest/frontend
npm install
npm run dev   # http://localhost:3000
```

---

## ⚙️ Konfiguration

### Environment Variables

| Variable | Default | Beschreibung | Erforderlich |
|----------|---------|--------------|:------------:|
| `NODE_ENV` | `production` | Node Environment | — |
| `PORT` | `3001` | Server Port | — |
| `HOST` | `0.0.0.0` | Server Host | — |
| `DB_PATH` | `data/heldevtest.db` | SQLite Datenbankpfad | — |
| `JWT_SECRET` | — | JWT Signing Secret | **Ja** |

### JWT_SECRET generieren

```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Port anpassen

```yaml
# docker-compose.yml
ports:
  - "8080:3001"  # Host-Port 8080, Container-Port 3001
```

---

## ✅ Installation verifizieren

```bash
# Health Check
curl http://localhost:3001/api/auth/status
# {"setupRequired":true}   → First-Run
# {"setupRequired":false}  → Bereit

# Docker Status
docker ps --format "table {{.Names}}\t{{.Status}}"
# NAMES        STATUS
# heldevtest   Up 2 minutes (healthy)
```

---

## 🔧 Troubleshooting

**Container startet nicht:**
```bash
docker logs heldevtest
# Ursachen: JWT_SECRET fehlt, Port belegt, Volume-Berechtigungen
```

**Datenbank locked:**
```bash
docker stop heldevtest
docker run --rm -v heldevtest-data:/data alpine \
  rm -f /data/heldevtest.db-shm /data/heldevtest.db-wal
docker start heldevtest
```

**Port bereits belegt:**
```bash
docker run ... -p 3002:3001 ...  # anderen Host-Port verwenden
```

---

## 🔄 Updates

```bash
# Docker Compose
docker-compose pull && docker-compose up -d

# Docker Run
docker pull ghcr.io/kreuzbube88/heldevtest:latest
docker stop heldevtest && docker rm heldevtest
# Neuen Container starten (gleiche Parameter wie bei Installation)
```

**Unraid:** Docker Tab → HELDEVTEST → Update Container

---

## 📊 Nächste Schritte

Nach erfolgreicher Installation:

1. ✅ [First-Run Setup durchführen](usage.de.md#first-run-setup)
2. 📝 [Ersten Test hochladen](usage.de.md#test-hochladen)
3. ✅ [Test ausführen](usage.de.md#test-ausführen)
4. 📊 [Ergebnisse exportieren](usage.de.md#export)

<div align="center">

[⬆ Nach oben](#installation)

</div>
