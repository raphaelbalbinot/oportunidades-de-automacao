# =========================================================
# STAGE 1: Build Frontend (React + Vite)
# =========================================================
FROM node:22-alpine AS client-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src/client/ ./src/client/
RUN npm run build:client

# =========================================================
# STAGE 2: Build Backend (Fastify + TypeScript + Prisma)
# =========================================================
FROM node:22-alpine AS server-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY prisma/ ./prisma/
RUN npx prisma generate

COPY src/server/ ./src/server/
RUN npm run build:server

# =========================================================
# STAGE 3: Production Runtime
# =========================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV DATABASE_URL="file:/data/app.db"

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Create persistent data folder for SQLite
RUN mkdir -p /data && chown -R node:node /data

COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generated client
COPY --from=server-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=server-builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=server-builder /app/prisma ./prisma

# Copy Backend Build
COPY --from=server-builder /app/dist/server ./dist/server

# Copy Frontend Static Build
COPY --from=client-builder /app/dist/client ./dist/client

USER node

EXPOSE 8080

CMD ["node", "dist/server/index.js"]
