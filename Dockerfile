# Base image
FROM node:20-alpine

# Cài thêm thư viện system cần thiết cho MySQL2 & Sequelize
RUN apk add --no-cache python3 make g++ bash

# App directory
WORKDIR /app

# Copy package files trước để tối ưu cache
COPY package*.json ./

# Cài dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Expose port BE Node.js
EXPOSE 8080

# Chạy backend
CMD ["node", "server.js"]
