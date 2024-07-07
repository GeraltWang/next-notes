FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN npm i --registry=https://registry.npmmirror.com

RUN npx prisma generate

RUN npm run build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

COPY prisma ./prisma/
COPY startup.sh ./startup.sh
RUN chmod +x /app/startup.sh

ENTRYPOINT ["sh", "/app/startup.sh"]
