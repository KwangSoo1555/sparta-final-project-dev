# Base image
FROM node:alpine

# Create app directory
RUN mkdir -p /var/app
WORKDIR /var/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Expose port 3333
EXPOSE 3333

# Start the server using the production build
CMD ["node", "dist/src/main.js"]