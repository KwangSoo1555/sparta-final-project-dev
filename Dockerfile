# Build stage
FROM node:20-alpine AS builder
WORKDIR /var/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
RUN apk add --no-cache tini
WORKDIR /var/app
RUN mkdir -p /var/app/logs && chown -R node:node /var/app
COPY --from=builder /var/app/dist ./dist
COPY --from=builder /var/app/package*.json ./
RUN npm ci --only=production
USER node
EXPOSE 3333
ENV NODE_ENV=production
ENV LOG_DIR=/var/app/logs
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/src/main.js"]