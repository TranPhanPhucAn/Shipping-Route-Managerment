# Install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
COPY . .
RUN pnpm run build


FROM node:20-alpine AS runner
WORKDIR /app
EXPOSE 3000

CMD ["pnpm", "start"]
