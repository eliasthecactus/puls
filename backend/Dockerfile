FROM node:25-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci --omit=dev && npx prisma generate

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
# The prisma CLI is a runtime dependency: without it `npx prisma migrate deploy`
# downloads whatever Prisma version is newest when the container starts.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts package.json ./

ENV NODE_ENV=production

EXPOSE 3001

CMD ["sh", "-c", "npx --no-install prisma migrate deploy && node dist/index.js"]
