<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Deployment

**HELDEVTEST Production Deployment Guide**

[🏠 Hauptseite](../README.md) | [📘 Dokumentation](README.de.md) | [🇬🇧 English](deployment.en.md)

</div>

---

## 📚 Inhaltsverzeichnis

- [Production Best Practices](#production-best-practices)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [SSL/TLS](#ssltls)
- [Backup & Restore](#backup--restore)
- [Monitoring](#monitoring)
- [Performance Tuning](#performance-tuning)

---

## 🚀 Production Best Practices

### Checkliste vor dem Launch

- [ ] `JWT_SECRET` gesetzt (min. 32 Zeichen, zufällig generiert)
- [ ] `NODE_ENV=production` gesetzt
- [ ] Datenbankpfad auf persistentes Volume gemappt
- [ ] Firewall: nur Port 3001 (oder Reverse-Proxy-Port) offen
- [ ] SSL/TLS konfiguriert (über Reverse Proxy)
- [ ] Backup-Strategie festgelegt
- [ ] Container mit `--restart unless-stopped`

### Minimale Production docker-compose.yml

```yaml
version: '3.8'

services:
  heldevtest:
    image: ghcr.io/kreuzbube88/heldevtest:latest
    container_name: heldevtest
    restart: unless-stopped
    ports:
      - "127.0.0.1:3001:3001"  # Nur lokal erreichbar (hinter Proxy)
    volumes:
      - heldevtest-data:/app/data
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}  # Aus .env Datei
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/auth/status"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  heldevtest-data:
```

```bash
# .env Datei (NICHT committen!)
JWT_SECRET=ihr-sehr-sicherer-schlüssel-min-32-zeichen
```

---

## 🔀 Reverse Proxy Setup

### nginx

```nginx
server {
    listen 80;
    server_name heldevtest.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name heldevtest.example.com;

    ssl_certificate /etc/ssl/certs/heldevtest.crt;
    ssl_certificate_key /etc/ssl/private/heldevtest.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Sicherheits-Header
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;

        # Timeouts für File-Upload
        client_max_body_size 10M;
        proxy_read_timeout 60s;
    }
}
```

### Traefik (Docker Labels)

```yaml
# docker-compose.yml mit Traefik Labels
services:
  heldevtest:
    image: ghcr.io/kreuzbube88/heldevtest:latest
    restart: unless-stopped
    volumes:
      - heldevtest-data:/app/data
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.heldevtest.rule=Host(`heldevtest.example.com`)"
      - "traefik.http.routers.heldevtest.entrypoints=websecure"
      - "traefik.http.routers.heldevtest.tls=true"
      - "traefik.http.routers.heldevtest.tls.certresolver=letsencrypt"
      - "traefik.http.services.heldevtest.loadbalancer.server.port=3001"
    networks:
      - traefik-public

networks:
  traefik-public:
    external: true

volumes:
  heldevtest-data:
```

### Caddy

```
heldevtest.example.com {
    reverse_proxy localhost:3001
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
    }
}
```

---

## 🔒 SSL/TLS

### Let's Encrypt mit Certbot (nginx)

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# Zertifikat anfordern
sudo certbot --nginx -d heldevtest.example.com

# Auto-Renewal testen
sudo certbot renew --dry-run

# Cron für Auto-Renewal (läuft automatisch nach certbot-Installation)
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### Let's Encrypt mit Traefik

Traefik übernimmt SSL automatisch über das `certresolver=letsencrypt` Label (siehe oben).

### Selbst-signiertes Zertifikat (nur intern)

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/heldevtest.key \
  -out /etc/ssl/certs/heldevtest.crt \
  -subj "/C=DE/ST=State/L=City/O=Org/CN=heldevtest.local"
```

---

## 💾 Backup & Restore

### Backup-Strategie

Die gesamten Daten liegen in **einer SQLite-Datei**: `/app/data/heldevtest.db`

#### Manuelles Backup

```bash
# Container läuft – SQLite-kompatibles Backup
docker exec heldevtest sqlite3 /app/data/heldevtest.db ".backup /app/data/backup_$(date +%Y%m%d_%H%M%S).db"

# Oder: Datei direkt kopieren (Container kurz stoppen für Konsistenz)
docker stop heldevtest
docker cp heldevtest:/app/data/heldevtest.db ./heldevtest_backup_$(date +%Y%m%d).db
docker start heldevtest
```

#### Automatisches Backup (Cron)

```bash
# /etc/cron.d/heldevtest-backup
0 2 * * * root docker exec heldevtest sqlite3 /app/data/heldevtest.db \
  ".backup /app/data/backup_$(date +\%Y\%m\%d).db" && \
  find /var/backups/heldevtest -name "backup_*.db" -mtime +30 -delete
```

#### Volume-Backup

```bash
# Gesamtes Volume sichern
docker run --rm \
  -v heldevtest-data:/data \
  -v /var/backups/heldevtest:/backup \
  alpine tar czf /backup/heldevtest_$(date +%Y%m%d).tar.gz -C /data .

# Alte Backups aufräumen (>30 Tage)
find /var/backups/heldevtest -name "*.tar.gz" -mtime +30 -delete
```

### Restore

```bash
# Container stoppen
docker stop heldevtest

# Backup einspielen
docker cp ./heldevtest_backup_20260404.db heldevtest:/app/data/heldevtest.db

# Container starten
docker start heldevtest

# Verifizieren
curl http://localhost:3001/api/auth/status
```

---

## 📊 Monitoring

### Docker Health Check

```bash
# Status prüfen
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Health Check Details
docker inspect --format='{{.State.Health.Status}}' heldevtest

# Logs (letzte 100 Zeilen)
docker logs --tail 100 heldevtest

# Logs live verfolgen
docker logs -f heldevtest
```

### Uptime Monitoring

**Endpunkt für externe Monitore:** `GET /api/auth/status`

- Erwartet: HTTP 200 + JSON
- Bei Fehler: HTTP 5xx

```bash
# Beispiel: cron-basierter Monitor
*/5 * * * * curl -sf http://localhost:3001/api/auth/status || \
  echo "HELDEVTEST DOWN" | mail -s "Alert" admin@example.com
```

**Empfohlene externe Tools:**
- [Uptime Kuma](https://github.com/louislam/uptime-kuma) (selbst gehostet)
- [Healthchecks.io](https://healthchecks.io)
- UptimeRobot (kostenlos bis 50 Monitore)

### Resource Monitoring

```bash
# Container-Ressourcen in Echtzeit
docker stats heldevtest

# Disk-Nutzung der Datenbank
docker exec heldevtest du -sh /app/data/heldevtest.db
```

---

## ⚡ Performance Tuning

### SQLite WAL-Modus

HELDEVTEST nutzt bereits WAL-Modus. Weitere Optimierungen:

```bash
# SQLite PRAGMA-Werte prüfen/setzen (im Container)
docker exec -it heldevtest sqlite3 /app/data/heldevtest.db \
  "PRAGMA journal_mode; PRAGMA synchronous; PRAGMA cache_size;"
```

### Container-Ressourcen begrenzen

```yaml
# docker-compose.yml
services:
  heldevtest:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 64M
```

### nginx Caching für statische Assets

```nginx
location ~* \.(js|css|png|jpg|ico|woff2)$ {
    proxy_pass http://127.0.0.1:3001;
    proxy_cache_valid 200 1d;
    add_header Cache-Control "public, max-age=86400";
}
```

### Empfohlene Server-Specs

| Nutzung | CPU | RAM | Disk |
|---------|-----|-----|------|
| Einzelperson | 1 vCore | 256 MB | 1 GB |
| Kleines Team (2-5) | 1 vCore | 512 MB | 5 GB |
| Intensiv (viele Sessions) | 2 vCores | 1 GB | 20 GB |

<div align="center">

[⬆ Nach oben](#deployment)

</div>
