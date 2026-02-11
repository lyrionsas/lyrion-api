# 1-Dependencias
FROM node:24-alpine3.21 AS deps

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install


# 2-Build
FROM node:24-alpine3.21 AS builder

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm ci -f --only=production && npm cache clean --force


# 3-Production image
FROM node:24-alpine3.21 AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json

EXPOSE 3000

CMD ["node", "dist/main.js"]