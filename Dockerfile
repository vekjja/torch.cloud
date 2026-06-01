FROM node:26-alpine AS builder

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

WORKDIR /app

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build


FROM node:26-alpine AS runner

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

CMD ["pnpm", "start"]