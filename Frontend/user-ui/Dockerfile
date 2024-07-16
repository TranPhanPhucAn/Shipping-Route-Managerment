# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

# Stage 2: Serve
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "start"]

