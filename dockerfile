# Chọn image Node.js phiên bản 22 làm base image
FROM node:22 

# Thiết lập thư mục làm việc trong container( và sau đó các lệnh cmd sẽ thực hiện trong thư mục này)
WORKDIR /app

COPY shared ./shared

# Copy toàn bộ mã file mã nguồn từ thư mục client trên máy vào container (tại thư mục /app)
COPY client ./client

WORKDIR /app/client

# Chạy lệnh để cài đặt toàn vộ dependencie vào trong container
RUN npm install 

EXPOSE 5173

# Chạy lệnh này để container được khởi động
CMD ["npm", "run", "dev", "--", "--host"]   