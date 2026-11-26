FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production PORT=3000
COPY --from=build /app ./
EXPOSE 3000
# Crea/actualiza las tablas, carga datos iniciales (solo si está vacío) y arranca.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node prisma/seed.mjs && npm start"]
