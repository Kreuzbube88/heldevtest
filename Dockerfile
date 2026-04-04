# Multi-stage build for HELDEVTEST

# Stage 1: Build backend
FROM node:24-alpine AS backend-builder

WORKDIR /app/backend

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build && npm prune --production

# Stage 2: Build frontend
FROM node:24-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 3: Production image
FROM node:24-alpine

WORKDIR /app

# Install libstdc++ for better-sqlite3 native addon
RUN apk add --no-cache libstdc++

# Copy backend production dependencies and build
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package.json ./backend/
COPY --from=backend-builder /app/backend/locales ./backend/locales

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Create data directory for SQLite
RUN mkdir -p /app/data

WORKDIR /app/backend

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/auth/status', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

CMD ["node", "dist/server.js"]
