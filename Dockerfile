<<<<<<< HEAD
FROM node:20-alpine
USER root
RUN mkdir -p /var/app
WORKDIR /var/app
COPY .env /var/app/.env
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3333
=======
FROM node:20-alpine
USER root
RUN mkdir -p /var/app
WORKDIR /var/app
COPY .env /var/app/.env
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3333
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
CMD ["node", "dist/src/main.js"]