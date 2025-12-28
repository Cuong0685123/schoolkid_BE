# --- GIAI ĐOẠN 1: BUILD (Xây dựng) ---
FROM node:20-alpine AS builder

# Cài đặt các công cụ cần thiết để biên dịch native modules (bcrypt, mysql2)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy các file quản lý thư viện trước
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm cả devDependencies nếu cần để build)
RUN npm install

# Copy toàn bộ mã nguồn vào
COPY . .

# --- GIAI ĐOẠN 2: PRODUCTION (Chạy thực tế) ---
FROM node:20-alpine

WORKDIR /app

# Chỉ copy những thứ cần thiết từ stage builder sang
# Điều này giúp loại bỏ hoàn toàn python, g++, make khỏi image cuối cùng
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Thiết lập các biến môi trường khớp với file .env của bạn
ENV NODE_ENV=production
ENV PORT=3000

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng bằng lệnh node (không dùng nodemon trong production)
CMD ["node", "server.js"]