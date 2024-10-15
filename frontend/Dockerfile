# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY tsconfig*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
COPY . .
RUN pnpm run build


FROM node:20-alpine AS runner
WORKDIR /app

# Copy node_modules and built application from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json


EXPOSE 3000

CMD ["pnpm", "start"]
