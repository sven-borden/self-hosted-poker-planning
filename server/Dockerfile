# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# ---- Runtime ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
CMD ["node", "dist/index.js"]
