# 🗄️ Database Schema - Mini Food

## 📊 Database Structure

Hệ thống sử dụng **MySQL** với 5 bảng chính:

---

## 👤 Table: `users`

Lưu thông tin người dùng và quản trị viên.

| Column     | Type         | Key     | Constraint     |
| ---------- | ------------ | ------- | -------------- |
| `id`       | INT          | PRIMARY | AUTO_INCREMENT |
| `username` | VARCHAR(50)  | UNIQUE  | NOT NULL       |
| `password` | VARCHAR(255) | -       | NOT NULL       |
| `role`     | VARCHAR(20)  | -       | DEFAULT 'USER' |

### Roles:

- `USER` - Người dùng thường (Nhân viên)
- `ADMIN` - Quản trị viên

### Sample Data:

```sql
INSERT INTO users VALUES
  (1, 'admin_dong', 'admin123', 'ADMIN'),
  (2, 'customer_01', 'user123', 'USER'),
  (3, 'customer_02', 'user123', 'USER');
```

---

## 🍽️ Table: `foods`

Danh sách các món ăn trong menu.

| Column        | Type         | Key     | Constraint     |
| ------------- | ------------ | ------- | -------------- |
| `id`          | INT          | PRIMARY | AUTO_INCREMENT |
| `name`        | VARCHAR(100) | -       | NOT NULL       |
| `price`       | DOUBLE       | -       | NOT NULL       |
| `description` | TEXT         | -       | -              |

### Sample Data:

```sql
INSERT INTO foods VALUES
  (1, 'Cơm Tấm Sườn Bì Chả', 45000, 'Cơm tấm truyền thống, sườn nướng mật ong'),
  (2, 'Bún Chả Hà Nội', 50000, 'Bún chả nướng than hoa, kèm nem chua'),
  (3, 'Phở Bò Tái Lăn', 55000, 'Phở bò gia truyền, nước dùng đậm đà'),
  (4, 'Trà Sữa Full Topping', 35000, 'Trà sữa Đài Loan, trân chân đen, thạch'),
  (5, 'Pizza Hải Sản', 120000, 'Pizza đế mỏng, tôm, mực, phô mai Mozzarella');
```

---

## 🛒 Table: `orders`

Đơn hàng chính.

| Column        | Type        | Key     | Constraint                |
| ------------- | ----------- | ------- | ------------------------- |
| `id`          | INT         | PRIMARY | AUTO_INCREMENT            |
| `user_id`     | INT         | FOREIGN | NOT NULL                  |
| `total_price` | DOUBLE      | -       | -                         |
| `status`      | VARCHAR(50) | -       | DEFAULT 'PENDING'         |
| `created_at`  | TIMESTAMP   | -       | DEFAULT CURRENT_TIMESTAMP |

### Status Values:

- `PENDING` - Chờ xác nhận
- `CONFIRMED` - Đã xác nhận
- `SHIPPING` - Đang giao
- `COMPLETED` - Hoàn thành
- `CANCELLED` - Đã hủy
- `PAID` - Đã thanh toán

### Relationships:

- `user_id` → `users.id` (FK)

### Sample Data:

```sql
INSERT INTO orders VALUES
  (1, 2, 80000, 'PAID', '2026-04-06 11:32:30'),
  (2, 2, 120000, 'PENDING', '2026-04-06 11:32:30');
```

---

## 📦 Table: `order_items`

Chi tiết các items trong từng đơn hàng (Line items).

| Column     | Type   | Key     | Constraint     |
| ---------- | ------ | ------- | -------------- |
| `id`       | INT    | PRIMARY | AUTO_INCREMENT |
| `order_id` | INT    | FOREIGN | NOT NULL       |
| `food_id`  | INT    | FOREIGN | NOT NULL       |
| `quantity` | INT    | -       | NOT NULL       |
| `price`    | DOUBLE | -       | NOT NULL       |

### Relationships:

- `order_id` → `orders.id` (FK)
- `food_id` → `foods.id` (FK)

### Sample Data:

```sql
INSERT INTO order_items VALUES
  (1, 1, 1, 1, 45000),  -- Order 1: 1x Cơm Tấm @ 45000
  (2, 1, 4, 1, 35000),  -- Order 1: 1x Trà Sữa @ 35000
  (3, 2, 5, 1, 120000); -- Order 2: 1x Pizza @ 120000
```

---

## 💳 Table: `payments`

Thông tin thanh toán.

| Column         | Type        | Key     | Constraint                |
| -------------- | ----------- | ------- | ------------------------- |
| `id`           | INT         | PRIMARY | AUTO_INCREMENT            |
| `order_id`     | INT         | FOREIGN | NOT NULL                  |
| `method`       | VARCHAR(50) | -       | NOT NULL                  |
| `amount`       | DOUBLE      | -       | NOT NULL                  |
| `payment_date` | TIMESTAMP   | -       | DEFAULT CURRENT_TIMESTAMP |

### Payment Methods:

- `COD` - Thanh toán khi nhận (Cash On Delivery)
- `BANKING` - Chuyển khoản ngân hàng

### Relationships:

- `order_id` → `orders.id` (FK)

### Sample Data:

```sql
INSERT INTO payments VALUES
  (1, 1, 'BANKING', 80000, '2026-04-06 11:32:30');
```

---

## 🔗 Relationships (ER Diagram)

```
┌─────────┐          ┌─────────────┐          ┌──────────┐
│  users  │          │   orders    │          │  foods   │
├─────────┤          ├─────────────┤          ├──────────┤
│ id (PK) │◄─────────│ user_id (FK)│          │ id (PK)  │
│ username│          │ id (PK)     │◄────┐    │ name     │
│ password│          │ total_price │     │    │ price    │
│ role    │          │ status      │     │    │ desc     │
└─────────┘          │ created_at  │     │    └──────────┘
                     └─────────────┘     │
                            ▲            │
                            │            │
                     ┌─────────────────┐  │
                     │ order_items     │  │
                     ├─────────────────┤  │
                     │ id (PK)         │  │
                     │ order_id (FK)   ├──┘
                     │ food_id (FK)    ├────┐
                     │ quantity        │    │
                     │ price           │    │
                     └─────────────────┘    │
                                            │
                     ┌─────────────────┐    │
                     │   payments      │    │
                     ├─────────────────┤    │
                     │ id (PK)         │    │
                     │ order_id (FK)   ├────┤
                     │ method          │    │
                     │ amount          │    │
                     │ payment_date    │    │
                     └─────────────────┘    │
                                             │
                                    ┌────────┘
                                    │
                            (Foreign Key)
```

---

## 🔑 Primary & Foreign Keys

| Table         | PK   | FK         | References  |
| ------------- | ---- | ---------- | ----------- |
| `users`       | `id` | -          | -           |
| `foods`       | `id` | -          | -           |
| `orders`      | `id` | `user_id`  | `users.id`  |
| `order_items` | `id` | `order_id` | `orders.id` |
| `order_items` | -    | `food_id`  | `foods.id`  |
| `payments`    | `id` | `order_id` | `orders.id` |

---

## 📝 SQL Queries Thường Dùng

### 1️⃣ Lấy danh sách đơn hàng của user với chi tiết items

```sql
SELECT
  o.id as order_id,
  o.total_price,
  o.status,
  o.created_at,
  oi.food_id,
  f.name as food_name,
  oi.quantity,
  oi.price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN foods f ON oi.food_id = f.id
WHERE o.user_id = 2
ORDER BY o.created_at DESC;
```

### 2️⃣ Lấy tất cả orders với tên user

```sql
SELECT
  o.id,
  u.username,
  o.total_price,
  o.status,
  o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
```

### 3️⃣ Tạo đơn hàng mới

```sql
-- 1. Tạo order
INSERT INTO orders (user_id, total_price, status)
VALUES (2, 145000, 'PENDING');

-- 2. Lấy order_id vừa tạo
SELECT LAST_INSERT_ID() as new_order_id;

-- 3. Thêm order items
INSERT INTO order_items (order_id, food_id, quantity, price) VALUES
  (3, 1, 2, 45000),  -- 2x Cơm Tấm
  (3, 4, 1, 35000);  -- 1x Trà Sữa

-- 4. Tạo payment
INSERT INTO payments (order_id, method, amount)
VALUES (3, 'COD', 145000);
```

### 4️⃣ Cập nhật trạng thái order

```sql
UPDATE orders SET status = 'COMPLETED' WHERE id = 1;
```

---

## ⚠️ Constraints & Validations

- **PK (Primary Key):** Đảm bảo unique, auto-increment
- **FK (Foreign Key):** Đảm bảo data integrity
- **UNIQUE:** username không được trùng
- **NOT NULL:** Các field bắt buộc
- **DEFAULT:** Giá trị mặc định

---

## 🔐 Data Integrity Rules

1. ✅ Mỗi order phải có user_id hợp lệ
2. ✅ Mỗi order_item phải belong vào order hợp lệ
3. ✅ Mỗi payment phải belong vào order hợp lệ
4. ✅ Username không được trùng
5. ✅ Food không được xóa nếu vẫn có order_items

---

## 📱 Backend API Pattern

### Lấy Food List

```
GET /api/foods
→ Query: SELECT * FROM foods
```

### Lấy User Orders

```
GET /api/orders/user/:userId
→ Query: SELECT ... FROM orders JOIN order_items ... WHERE user_id = ?
```

### Tạo Order

```
POST /api/orders
Body: { userId, items: [{foodId, quantity, price}], totalPrice }
→ INSERT INTO orders... + INSERT INTO order_items...
```

### Tạo Payment

```
POST /api/payments
Body: { orderId, method, amount }
→ INSERT INTO payments...
→ UPDATE orders SET status = 'PAID' WHERE id = ?
```

---

**Backend team sử dụng schema này để implement Services! 🚀**
