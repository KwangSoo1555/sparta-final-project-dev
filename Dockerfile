# Build stage
FROM node:18-alpine AS builder
WORKDIR /var/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
RUN apk add --no-cache tini
WORKDIR /var/app
COPY --from=builder /var/app/dist ./dist
COPY --from=builder /var/app/package*.json ./
RUN npm ci --only=production
USER node
EXPOSE 3333
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/src/main.js"]