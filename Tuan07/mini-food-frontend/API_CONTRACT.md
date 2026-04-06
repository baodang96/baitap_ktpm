# 🔗 API Contract - Backend Service Specifications

Frontend cần các endpoint backend sau, dựa trên **Database Schema** từ `minifood.sql`.

---

## 👤 USER SERVICE (Port 8081)

### **1. Đăng Ký**

```http
POST /api/users/register
Content-Type: application/json
```

**Request:**

```json
{
  "username": "customer_01",
  "password": "user123",
  "name": "Nguyễn Văn A"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "id": 2,
    "username": "customer_01",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### **2. Đăng Nhập**

```http
POST /api/users/login
Content-Type: application/json
```

**Request:**

```json
{
  "username": "customer_01",
  "password": "user123"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "id": 2,
    "username": "customer_01",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (401):**

```json
{
  "message": "Username hoặc mật khẩu không đúng"
}
```

---

### **3. Lấy Danh Sách Users (Admin)**

```http
GET /api/users
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "username": "admin_dong",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "customer_01",
    "role": "USER"
  }
]
```

---

### **4. Lấy Thông Tin User Hiện Tại**

```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "id": 2,
  "username": "customer_01",
  "role": "USER"
}
```

---

## 🍽️ FOOD SERVICE (Port 8082)

### **1. Lấy Danh Sách Tất Cả Món Ăn**

```http
GET /api/foods
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Cơm Tấm Sườn Bì Chả",
    "price": 45000,
    "description": "Cơm tấm truyền thống, sườn nướng mật ong"
  },
  {
    "id": 2,
    "name": "Bún Chả Hà Nội",
    "price": 50000,
    "description": "Bún chả nướng than hoa, kèm nem chua"
  },
  {
    "id": 3,
    "name": "Phở Bò Tái Lăn",
    "price": 55000,
    "description": "Phở bò gia truyền, nước dùng đậm đà"
  },
  {
    "id": 4,
    "name": "Trà Sữa Full Topping",
    "price": 35000,
    "description": "Trà sữa Đài Loan, trân chân đen, thạch"
  },
  {
    "id": 5,
    "name": "Pizza Hải Sản",
    "price": 120000,
    "description": "Pizza đế mỏng, tôm, mực, phô mai Mozzarella"
  }
]
```

---

### **2. Lấy Chi Tiết Một Món Ăn**

```http
GET /api/foods/{id}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Cơm Tấm Sườn Bì Chả",
  "price": 45000,
  "description": "Cơm tấm truyền thống, sườn nướng mật ong"
}
```

---

### **3. Thêm Món Ăn (Admin)**

```http
POST /api/foods
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**

```json
{
  "name": "Bánh Mì Thịt",
  "price": 25000,
  "description": "Bánh mì nóng, thịt, pâté, cà chua"
}
```

**Response (201 Created):**

```json
{
  "id": 6,
  "name": "Bánh Mì Thịt",
  "price": 25000,
  "description": "Bánh mì nóng, thịt, pâté, cà chua"
}
```

---

### **4. Cập Nhật Món Ăn (Admin)**

```http
PUT /api/foods/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**

```json
{
  "name": "Cơm Tấm Sườn Bì Chả (Updated)",
  "price": 48000
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Cơm Tấm Sườn Bì Chả (Updated)",
  "price": 48000,
  "description": "Cơm tấm truyền thống, sườn nướng mật ong"
}
```

---

### **5. Xóa Món Ăn (Admin)**

```http
DELETE /api/foods/{id}
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
{
  "message": "Xóa thành công"
}
```

---

## 🛒 ORDER SERVICE (Port 8083)

### **1. Tạo Đơn Hàng**

```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "userId": 2,
  "items": [
    {
      "foodId": 1,
      "quantity": 2,
      "price": 45000
    },
    {
      "foodId": 4,
      "quantity": 1,
      "price": 35000
    }
  ],
  "totalPrice": 125000,
  "status": "PENDING"
}
```

**Response (201 Created):**

```json
{
  "id": 3,
  "userId": 2,
  "totalPrice": 125000,
  "status": "PENDING",
  "createdAt": "2026-04-06T11:32:30Z",
  "items": [
    {
      "foodId": 1,
      "quantity": 2,
      "price": 45000
    },
    {
      "foodId": 4,
      "quantity": 1,
      "price": 35000
    }
  ]
}
```

---

### **2. Lấy Đơn Hàng Của User**

```http
GET /api/orders/user/{userId}
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "userId": 2,
    "totalPrice": 80000,
    "status": "PAID",
    "createdAt": "2026-04-06T11:32:30Z"
  },
  {
    "id": 2,
    "userId": 2,
    "totalPrice": 120000,
    "status": "PENDING",
    "createdAt": "2026-04-06T11:32:30Z"
  }
]
```

---

### **3. Lấy Danh Sách Tất Cả Đơn (Admin)**

```http
GET /api/orders
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "userId": 2,
    "totalPrice": 80000,
    "status": "PAID",
    "createdAt": "2026-04-06T11:32:30Z"
  },
  {
    "id": 2,
    "userId": 2,
    "totalPrice": 120000,
    "status": "PENDING",
    "createdAt": "2026-04-06T11:32:30Z"
  }
]
```

---

### **4. Lấy Chi Tiết Một Đơn Hàng**

```http
GET /api/orders/{orderId}
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "userId": 2,
  "totalPrice": 80000,
  "status": "PAID",
  "createdAt": "2026-04-06T11:32:30Z",
  "items": [
    {
      "foodId": 1,
      "foodName": "Cơm Tấm Sườn Bì Chả",
      "quantity": 1,
      "price": 45000
    },
    {
      "foodId": 4,
      "foodName": "Trà Sữa Full Topping",
      "quantity": 1,
      "price": 35000
    }
  ]
}
```

---

### **5. Cập Nhật Trạng Thái Đơn Hàng (Admin)**

```http
PUT /api/orders/{orderId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**

```json
{
  "status": "CONFIRMED"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "status": "CONFIRMED",
  "updatedAt": "2026-04-06T11:35:00Z"
}
```

**Status Values:**

- `PENDING` - Chờ xác nhận
- `CONFIRMED` - Đã xác nhận
- `SHIPPING` - Đang giao
- `COMPLETED` - Hoàn thành
- `PAID` - Đã thanh toán
- `CANCELLED` - Đã hủy

---

## 💳 PAYMENT SERVICE (Port 8084)

### **1. Tạo Thanh Toán**

```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**

```json
{
  "orderId": 3,
  "method": "COD",
  "amount": 125000
}
```

**Response (201 Created):**

```json
{
  "id": 2,
  "orderId": 3,
  "method": "COD",
  "amount": 125000,
  "paymentDate": "2026-04-06T11:45:00Z"
}
```

**Payment Methods:**

- `COD` - Thanh toán khi nhận
- `BANKING` - Chuyển khoản

---

### **2. Lấy Danh Sách Thanh Toán (Admin)**

```http
GET /api/payments
Authorization: Bearer {admin_token}
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "orderId": 1,
    "method": "BANKING",
    "amount": 80000,
    "paymentDate": "2026-04-06T11:32:30Z"
  },
  {
    "id": 2,
    "orderId": 3,
    "method": "COD",
    "amount": 125000,
    "paymentDate": "2026-04-06T11:45:00Z"
  }
]
```

---

### **3. Lấy Chi Tiết Thanh Toán**

```http
GET /api/payments/{paymentId}
Authorization: Bearer {token}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "orderId": 1,
  "method": "BANKING",
  "amount": 80000,
  "paymentDate": "2026-04-06T11:32:30Z"
}
```

---

### **4. Cập Nhật Trạng Thái Thanh Toán (Admin)**

```http
PUT /api/payments/{paymentId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request:**

```json
{
  "status": "COMPLETED"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "status": "COMPLETED",
  "updatedAt": "2026-04-06T11:40:00Z"
}
```

---

## ⚠️ Error Responses

### **400 Bad Request**

```json
{
  "message": "Invalid request",
  "errors": ["foodId is required", "quantity must be > 0"]
}
```

### **401 Unauthorized**

```json
{
  "message": "Invalid token or not authenticated"
}
```

### **403 Forbidden**

```json
{
  "message": "You don't have permission to perform this action"
}
```

### **404 Not Found**

```json
{
  "message": "Resource not found"
}
```

### **500 Internal Server Error**

```json
{
  "message": "Internal server error",
  "error": "..."
}
```

---

## ⚙️ CORS Configuration

**TẤT CẢ services PHẢI cấu hình CORS:**

```
Origin: http://{FRONTEND_IP}:5173
Methods: GET, POST, PUT, DELETE, OPTIONS
Headers: Content-Type, Authorization
Credentials: true
```

---

## 🔐 Authentication

- JWT Token được cấp từ `/login` hoặc `/register`
- Gửi token trong header: `Authorization: Bearer {token}`
- Status 401 → Logout + redirect `/login`

---

## 📊 Database Reference

Chi tiết bảng tham khảo tại: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

**Backend team implement theo contract này! 🚀**
