# Base image (nhẹ + ổn định cho MySQL2)
FROM node:20-alpine

# Cài môi trường build MySQL2
RUN apk add --no-cache python3 make g++ bash

# Set working directory
WORKDIR /app

# Copy package files trước
COPY package*.json ./

# Cài dependencies
RUN npm install --production

# Copy source code
COPY . .

# Render sẽ inject ENV -> dotenv tự đọc được
ENV NODE_ENV=production

# Expose PORT (Render sẽ map)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
