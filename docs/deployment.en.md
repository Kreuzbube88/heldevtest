<div align="center">

<img src="../frontend/public/logo.png" alt="HELDEVTEST Logo" width="150"/>

# Deployment

**HELDEVTEST Production Deployment Guide**

[🏠 Home](../README.md) | [📘 Documentation](README.en.md) | [🇩🇪 Deutsch](deployment.de.md)

</div>

---

## 📚 Table of Contents

- [Production Best Practices](#production-best-practices)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [SSL/TLS](#ssltls)
- [Backup & Restore](#backup--restore)
- [Monitoring](#monitoring)
- [Performance Tuning](#performance-tuning)

---

## 🚀 Production Best Practices

### Pre-Launch Checklist

- [ ] `JWT_SECRET` set (min. 32 characters, randomly generated)
- [ ] `NODE_ENV=production` set
- [ ] Database path mapped to persistent volume
- [ ] Firewall: only port 3001 (or reverse proxy port) open
- [ ] SSL/TLS configured (via reverse proxy)
- [ ] Backup strategy defined
- [ ] Container with `--restart unless-stopped`

### Minimal Production docker-compose.yml

```yaml
version: '3.8'

services:
  heldevtest:
    image: ghcr.io/kreuzbube88/heldevtest:latest
    container_name: heldevtest
    restart: unless-stopped
    ports:
      - "127.0.0.1:3001:3001"  # Localhost only (behind proxy)
    volumes:
      - heldevtest-data:/app/data
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}  # From .env file
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/auth/status"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  heldevtest-data:
```

```bash
# .env file (do NOT commit!)
JWT_SECRET=your-very-secure-key-min-32-characters
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

    # Security headers
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

        # Timeouts for file upload
        client_max_body_size 10M;
        proxy_read_timeout 60s;
    }
}
```

### Traefik (Docker Labels)

```yaml
# docker-compose.yml with Traefik labels
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

### Let's Encrypt with Certbot (nginx)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Request certificate
sudo certbot --nginx -d heldevtest.example.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Let's Encrypt with Traefik

Traefik handles SSL automatically via the `certresolver=letsencrypt` label (see above).

### Self-signed Certificate (internal only)

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/heldevtest.key \
  -out /etc/ssl/certs/heldevtest.crt \
  -subj "/C=US/ST=State/L=City/O=Org/CN=heldevtest.local"
```

---

## 💾 Backup & Restore

### Backup Strategy

All data resides in **one SQLite file**: `/app/data/heldevtest.db`

#### Manual Backup

```bash
# Container running – SQLite-compatible backup
docker exec heldevtest sqlite3 /app/data/heldevtest.db ".backup /app/data/backup_$(date +%Y%m%d_%H%M%S).db"

# Or: copy file directly (briefly stop container for consistency)
docker stop heldevtest
docker cp heldevtest:/app/data/heldevtest.db ./heldevtest_backup_$(date +%Y%m%d).db
docker start heldevtest
```

#### Automated Backup (Cron)

```bash
# /etc/cron.d/heldevtest-backup
0 2 * * * root docker exec heldevtest sqlite3 /app/data/heldevtest.db \
  ".backup /app/data/backup_$(date +\%Y\%m\%d).db" && \
  find /var/backups/heldevtest -name "backup_*.db" -mtime +30 -delete
```

#### Volume Backup

```bash
# Back up entire volume
docker run --rm \
  -v heldevtest-data:/data \
  -v /var/backups/heldevtest:/backup \
  alpine tar czf /backup/heldevtest_$(date +%Y%m%d).tar.gz -C /data .

# Clean up old backups (>30 days)
find /var/backups/heldevtest -name "*.tar.gz" -mtime +30 -delete
```

### Restore

```bash
# Stop container
docker stop heldevtest

# Restore backup
docker cp ./heldevtest_backup_20260404.db heldevtest:/app/data/heldevtest.db

# Start container
docker start heldevtest

# Verify
curl http://localhost:3001/api/auth/status
```

---

## 📊 Monitoring

### Docker Health Check

```bash
# Check status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Health check details
docker inspect --format='{{.State.Health.Status}}' heldevtest

# Logs (last 100 lines)
docker logs --tail 100 heldevtest

# Follow logs live
docker logs -f heldevtest
```

### Uptime Monitoring

**Endpoint for external monitors:** `GET /api/auth/status`

- Expected: HTTP 200 + JSON
- On error: HTTP 5xx

```bash
# Example: cron-based monitor
*/5 * * * * curl -sf http://localhost:3001/api/auth/status || \
  echo "HELDEVTEST DOWN" | mail -s "Alert" admin@example.com
```

**Recommended external tools:**
- [Uptime Kuma](https://github.com/louislam/uptime-kuma) (self-hosted)
- [Healthchecks.io](https://healthchecks.io)
- UptimeRobot (free up to 50 monitors)

### Resource Monitoring

```bash
# Container resources in real-time
docker stats heldevtest

# Database disk usage
docker exec heldevtest du -sh /app/data/heldevtest.db
```

---

## ⚡ Performance Tuning

### SQLite WAL Mode

HELDEVTEST already uses WAL mode. Additional optimizations:

```bash
# Check/set SQLite PRAGMA values (in container)
docker exec -it heldevtest sqlite3 /app/data/heldevtest.db \
  "PRAGMA journal_mode; PRAGMA synchronous; PRAGMA cache_size;"
```

### Limit Container Resources

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

### nginx Caching for Static Assets

```nginx
location ~* \.(js|css|png|jpg|ico|woff2)$ {
    proxy_pass http://127.0.0.1:3001;
    proxy_cache_valid 200 1d;
    add_header Cache-Control "public, max-age=86400";
}
```

### Recommended Server Specs

| Usage | CPU | RAM | Disk |
|-------|-----|-----|------|
| Individual | 1 vCore | 256 MB | 1 GB |
| Small team (2-5) | 1 vCore | 512 MB | 5 GB |
| Intensive (many sessions) | 2 vCores | 1 GB | 20 GB |

<div align="center">

[⬆ Back to top](#deployment)

</div>
