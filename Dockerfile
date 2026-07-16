# Build stage
FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@11.5.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .env.test ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN cp .env.test .env \
	&& pnpm run prepare \
	&& pnpm run build

# Runtime stage
FROM node:22-slim

ENV PORT=1026
ENV HOST=0.0.0.0
ENV BODY_SIZE_LIMIT=1000M

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 1026

CMD ["node", "build/index.js"]
