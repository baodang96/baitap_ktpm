# 🍜 Mini Food Ordering System

> Hệ thống đặt món ăn nội bộ - Service-Based Architecture

## 📐 Kiến trúc

```
┌─────────────────┐
│   Frontend      │  React + Vite (:5173)
│   (ReactJS)     │
└────┬──┬──┬──┬───┘
     │  │  │  │  REST API (HTTP)
     ▼  ▼  ▼  ▼
┌────┐ ┌────┐ ┌────┐ ┌────────┐
│User│ │Food│ │Ord-│ │Payment │
│Svc │ │Svc │ │er  │ │+ Notif │
│8081│ │8082│ │8083│ │  8084  │
└────┘ └────┘ └──┬─┘ └───┬────┘
                 │       │
          ┌──────┘       │
          ▼              ▼
     Food + User    Order Service
     Services       (update status)
```

## 🚀 Chạy nhanh (1 máy)

### Cài đặt
```bash
# Cài tất cả dependencies
install-all.bat
```

### Khởi chạy
```bash
# Chạy tất cả services + frontend
start-all.bat
```

Hoặc chạy thủ công từng service:
```bash
# Terminal 1
cd user-service && node server.js

# Terminal 2
cd food-service && node server.js

# Terminal 3
cd order-service && node server.js

# Terminal 4
cd payment-service && node server.js

# Terminal 5
cd frontend && npx vite --host
```

### Truy cập
- **Frontend**: http://localhost:5173
- **User Service**: http://localhost:8081
- **Food Service**: http://localhost:8082
- **Order Service**: http://localhost:8083
- **Payment Service**: http://localhost:8084

### Tài khoản demo
- **Admin**: `admin@food.com` / `admin123`

---

## 🌐 Triển khai nhiều máy (LAN)

### Bước 1: Mỗi người copy service về máy mình

| Người | Service | Máy | Port |
|-------|---------|-----|------|
| 1 | Frontend | 192.168.x.10 | 5173 |
| 2 | User Service | 192.168.x.11 | 8081 |
| 3 | Food Service | 192.168.x.12 | 8082 |
| 4 | Order Service | 192.168.x.13 | 8083 |
| 5 | Payment Service | 192.168.x.14 | 8084 |

### Bước 2: Cấu hình IP

**Backend (Order & Payment):** Sửa biến môi trường trước khi chạy:
```bash
# Order Service (máy 192.168.x.13)
set USER_SERVICE_URL=http://192.168.x.11:8081
set FOOD_SERVICE_URL=http://192.168.x.12:8082
node server.js

# Payment Service (máy 192.168.x.14)
set ORDER_SERVICE_URL=http://192.168.x.13:8083
node server.js
```

**Frontend:** Sửa file `frontend/src/config.js`:
```js
const config = {
  USER_SERVICE:    'http://192.168.x.11:8081',
  FOOD_SERVICE:    'http://192.168.x.12:8082',
  ORDER_SERVICE:   'http://192.168.x.13:8083',
  PAYMENT_SERVICE: 'http://192.168.x.14:8084',
};
```

---

## 🐳 Docker

```bash
# Chạy toàn bộ hệ thống
docker-compose up --build

# Dừng
docker-compose down
```

---

## 📋 API Endpoints

### User Service (:8081)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/verify` | Xác thực JWT |
| GET | `/api/users` | Danh sách users |
| GET | `/api/users/:id` | Chi tiết user |

### Food Service (:8082)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/foods` | Danh sách món |
| GET | `/api/foods/:id` | Chi tiết món |
| POST | `/api/foods` | Thêm món |
| PUT | `/api/foods/:id` | Sửa món |
| DELETE | `/api/foods/:id` | Xóa món |

### Order Service (:8083)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/orders` | Tất cả đơn hàng |
| GET | `/api/orders/user/:userId` | Đơn theo user |
| GET | `/api/orders/:id` | Chi tiết đơn |
| PUT | `/api/orders/:id/status` | Cập nhật trạng thái |
| PUT | `/api/orders/:id/payment` | Cập nhật thanh toán |

### Payment Service (:8084)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/payments` | Thanh toán |
| GET | `/api/payments` | Lịch sử thanh toán |
| GET | `/api/payments/order/:orderId` | Thanh toán theo đơn |
| GET | `/api/notifications` | Danh sách thông báo |

---

## 🧪 Kịch bản Test (Demo)

1. ✅ Đăng ký tài khoản mới
2. ✅ Đăng nhập
3. ✅ Xem danh sách món ăn
4. ✅ Tìm kiếm / lọc theo danh mục
5. ✅ Thêm món vào giỏ hàng
6. ✅ Điều chỉnh số lượng trong giỏ
7. ✅ Chọn phương thức thanh toán (COD/Banking)
8. ✅ Đặt hàng → tạo order → thanh toán
9. ✅ Xem lịch sử đơn hàng
10. ✅ Nhận thông báo (console log trên Payment Service)
11. ✅ Admin: CRUD món ăn

---

## ⚙️ Tech Stack

- **Frontend**: React 18 + Vite + Axios + React Router
- **Backend**: Express.js (Node.js)
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Storage**: In-memory (JavaScript)
- **Containerization**: Docker + Docker Compose
