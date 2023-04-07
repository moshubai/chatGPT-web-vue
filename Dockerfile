# build front-end
# FROM node:lts-alpine AS builder
FROM node:19 AS app

COPY /dist /app
WORKDIR /app

# RUN apk add --no-cache git \
#     && npm install pnpm -g \
#     && pnpm install \
#     && pnpm run build \
#     && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

# service
FROM node:lts-alpine

COPY /service /app
COPY --from=builder /app/dist /app/public

WORKDIR /app
RUN apk add --no-cache git \
    && npm install pnpm -g \
    && pnpm install --only=production \
    && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*


EXPOSE 3002

CMD ["pnpm", "run", "start"]
