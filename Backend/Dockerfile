FROM node:alpine as base-stage
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

FROM base-stage as build-stage
# Build arguments for different services
ARG SERVICE_PATH
ENV SERVICE_PATH=${SERVICE_PATH}

COPY apps/${SERVICE_PATH}/tsconfig.app.json ./tsconfig.app.json
COPY apps/${SERVICE_PATH}/src ./src
RUN pnpm run build

FROM node:alpine as final-stage
WORKDIR /usr/app
COPY --from=build-stage /usr/app/node_modules ./node_modules
COPY --from=build-stage /usr/app/dist ./dist

CMD [ "node", "dist/main" ]