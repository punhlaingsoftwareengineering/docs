# Build stage
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc .env.test ./
RUN npm ci

COPY . .
RUN cp .env.test .env \
	&& npm run prepare \
	&& npm run build

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
