# 🛍️ Clothing Store Management System

Hệ thống quản lý bán quần áo trực tuyến được xây dựng với React + NestJS, hỗ trợ đầy đủ các nghiệp vụ từ quản lý sản phẩm, xử lý đơn hàng đến thanh toán MoMo và báo cáo doanh thu.

---

## ✨ Tính năng chính

- **Quản lý sản phẩm & danh mục** — CRUD sản phẩm, phân loại theo danh mục, quản lý tồn kho
- **Quản lý đơn hàng** — Theo dõi trạng thái đơn hàng, hủy đơn, cập nhật địa chỉ giao hàng
- **Thanh toán MoMo** — Tích hợp cổng thanh toán ví điện tử MoMo
- **Xác thực & phân quyền** — JWT authentication, phân quyền Admin / User
- **Quản lý khách hàng** — Phân biệt khách vãng lai và khách hàng thành viên
- **Báo cáo doanh thu** — Thống kê và xem báo cáo doanh thu theo thời gian

---

## 🛠️ Công nghệ sử dụng

| Layer          | Công nghệ                               |
| -------------- | --------------------------------------- |
| Frontend       | ReactJS, TypeScript, Vite, Tailwind CSS |
| Backend        | Node.js, NestJS                         |
| Authentication | JWT (JSON Web Token)                    |
| Payment        | MoMo Payment Gateway                    |

---

## 🚀 Cài đặt & chạy dự án

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn

### 1. Clone repository

```bash
git clone https://github.com/NguyenTrgKien/manage-sell-client.git
cd manage-sell-client
```

### 2. Cài đặt dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backend`:

```env
# Server
PORT=3000

# Database
DATABASE_URL=your_database_url

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# MoMo Payment
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_REDIRECT_URL=http://localhost:5173/payment/result
MOMO_IPN_URL=http://your-server/payment/momo/ipn
```

Tạo file `.env` trong thư mục `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Khởi động

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

Truy cập: `http://localhost:5173`

---

## 📁 Cấu trúc thư mục

```
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Các trang
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API calls
│   │   └── types/          # TypeScript types
│   └── ...
│
└── backend/                # NestJS
    ├── src/
    │   ├── modules/
    │   │   ├── auth/           # JWT authentication
    │   │   ├── users/          # Quản lý người dùng
    │   │   ├── products/       # Quản lý sản phẩm
    │   │   ├── categories/     # Danh mục sản phẩm
    │   │   ├── orders/         # Quản lý đơn hàng
    │   │   ├── payment/        # Tích hợp MoMo
    │   │   └── reports/        # Báo cáo doanh thu
    │   ├── app.module.ts
    │   └── main.ts
    └── ...
```

---

## 🔐 Phân quyền

| Chức năng                   | User | Admin |
| --------------------------- | :--: | :---: |
| Xem sản phẩm                |  ✅  |  ✅   |
| Đặt hàng / Hủy đơn          |  ✅  |  ✅   |
| Chỉnh sửa địa chỉ           |  ✅  |  ✅   |
| Thanh toán MoMo             |  ✅  |  ✅   |
| Quản lý sản phẩm & danh mục |  ❌  |  ✅   |
| Quản lý tất cả đơn hàng     |  ❌  |  ✅   |
| Quản lý khách hàng          |  ❌  |  ✅   |
| Xem báo cáo doanh thu       |  ❌  |  ✅   |

---

## 📄 License

MIT License © 2025
