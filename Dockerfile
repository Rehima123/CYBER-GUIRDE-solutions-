# Multi-stage build for production

# Backend Stage
FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# Frontend Stage
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend /app/backend ./backend

# Copy frontend build
COPY --from=frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]
