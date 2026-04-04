<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Installation

**HELDEVTEST Installation Guide**

[🏠 Home](../README.md) | [📘 Documentation](README.en.md) | [🇩🇪 Deutsch](installation.de.md)

</div>

---

## 📦 Installation Methods

### 1️⃣ Docker Compose (Recommended)

**Prerequisites:** Docker 20.10+, Docker Compose 2.0+

```bash
# Clone repository
git clone https://github.com/Kreuzbube88/heldevtest
cd heldevtest

# Start container
docker-compose up -d

# Check logs
docker-compose logs -f
```

**Access:** http://localhost:3001

**Stop:**
```bash
docker-compose down

# With data deletion (caution!)
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

**Container Management:**
```bash
docker logs -f heldevtest    # Logs
docker stop heldevtest       # Stop
docker start heldevtest      # Start
docker restart heldevtest    # Restart
docker rm -f heldevtest      # Remove
```

---

### 3️⃣ Unraid Community Store

1. Open **Apps** tab → **Community Applications**
2. Search for `HELDEVTEST`
3. Click **Install**
4. Configure port `3001` (or keep default)
5. Click **Apply** → Container starts
6. Access: `http://UNRAID-IP:3001`

**Manual Template Installation (if not in store):**
```bash
# SSH to Unraid server
ssh root@UNRAID-IP

# Download template
wget https://raw.githubusercontent.com/Kreuzbube88/heldevtest/main/heldevtest.xml \
  -O /boot/config/plugins/dockerMan/templates-user/heldevtest.xml
```
Then: Docker tab → Add Container → Template: HELDEVTEST

---

### 4️⃣ Manual Installation (Development)

**Prerequisites:** Node.js 24+, npm 10+

**Backend:**
```bash
git clone https://github.com/Kreuzbube88/heldevtest
cd heldevtest/backend
npm install
npm run dev   # http://localhost:3001
```

**Frontend (separate terminal):**
```bash
cd heldevtest/frontend
npm install
npm run dev   # http://localhost:3000
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|:--------:|
| `NODE_ENV` | `production` | Node Environment | — |
| `PORT` | `3001` | Server Port | — |
| `HOST` | `0.0.0.0` | Server Host | — |
| `DB_PATH` | `data/heldevtest.db` | SQLite Database Path | — |
| `JWT_SECRET` | — | JWT Signing Secret | **Yes** |

### Generate JWT_SECRET

```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Change Port

```yaml
# docker-compose.yml
ports:
  - "8080:3001"  # Host port 8080, container port 3001
```

---

## ✅ Verify Installation

```bash
# Health check
curl http://localhost:3001/api/auth/status
# {"setupRequired":true}   → First-run
# {"setupRequired":false}  → Ready

# Docker status
docker ps --format "table {{.Names}}\t{{.Status}}"
# NAMES        STATUS
# heldevtest   Up 2 minutes (healthy)
```

---

## 🔧 Troubleshooting

**Container won't start:**
```bash
docker logs heldevtest
# Causes: missing JWT_SECRET, port occupied, volume permissions
```

**Database locked:**
```bash
docker stop heldevtest
docker run --rm -v heldevtest-data:/data alpine \
  rm -f /data/heldevtest.db-shm /data/heldevtest.db-wal
docker start heldevtest
```

**Port already in use:**
```bash
docker run ... -p 3002:3001 ...  # use different host port
```

---

## 🔄 Updates

```bash
# Docker Compose
docker-compose pull && docker-compose up -d

# Docker Run
docker pull ghcr.io/kreuzbube88/heldevtest:latest
docker stop heldevtest && docker rm heldevtest
# Start new container (same parameters as installation)
```

**Unraid:** Docker tab → HELDEVTEST → Update Container

---

## 📊 Next Steps

After successful installation:

1. ✅ [Complete First-Run Setup](usage.en.md#first-run-setup)
2. 📝 [Upload first test](usage.en.md#upload-test)
3. ✅ [Execute tests](usage.en.md#execute-tests)
4. 📊 [Export results](usage.en.md#export)

<div align="center">

[⬆ Back to top](#installation)

</div>
