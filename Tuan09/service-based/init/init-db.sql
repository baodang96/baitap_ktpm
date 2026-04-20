CREATE DATABASE IF NOT EXISTS food_ordering_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_ordering_db;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    category VARCHAR(255) DEFAULT 'Món chính',
    image TEXT,
    available BOOLEAN DEFAULT TRUE,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    userName VARCHAR(255) NOT NULL,
    items JSON NOT NULL,
    totalAmount INT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    paymentStatus VARCHAR(50) DEFAULT 'UNPAID',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (userId)
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    orderId VARCHAR(50) NOT NULL,
    userId VARCHAR(50) NOT NULL,
    userName VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (orderId)
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    userName VARCHAR(255) NOT NULL,
    orderId VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    r_read BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (userId)
);

-- Seed Admin User (password is 'admin123' bcrypt hashed)
-- We insert raw hash value generated from node bcrypt(10)
INSERT IGNORE INTO users (id, name, email, password, role) VALUES 
('USR-ADMIN', 'Admin', 'admin@food.com', '$2a$10$N7BELXEjuSCjvNySbqdy.efs0TVhN.ShH88ZRFAR/wcNNgNIWzmHa', 'ADMIN');

-- Seed Foods
INSERT IGNORE INTO foods (id, name, description, price, category, image, available) VALUES
('FOOD-001', 'Phở Bò Tái Chín', 'Phở bò truyền thống với nước dùng đậm đà, thịt bò tái chín mềm.', 55000, 'Món chính', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop', 1),
('FOOD-002', 'Bún Bò Huế', 'Bún bò Huế cay nồng, đậm vị với giò heo và chả cua.', 60000, 'Món chính', 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400&h=300&fit=crop', 1),
('FOOD-003', 'Cơm Tấm Sườn Bì Chả', 'Cơm tấm Sài Gòn với sườn nướng, bì và chả trứng.', 50000, 'Món chính', 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&h=300&fit=crop', 1),
('FOOD-004', 'Bánh Mì Thịt Nướng', 'Bánh mì giòn với thịt nướng, đồ chua và rau thơm.', 30000, 'Ăn nhẹ', 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&h=300&fit=crop', 1),
('FOOD-005', 'Gỏi Cuốn Tôm Thịt', 'Gỏi cuốn tươi mát với tôm, thịt luộc và bún, chấm tương đậu.', 35000, 'Ăn nhẹ', 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400&h=300&fit=crop', 1),
('FOOD-006', 'Bún Chả Hà Nội', 'Bún chả với thịt nướng thơm lừng, nước mắm chua ngọt.', 50000, 'Món chính', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', 1),
('FOOD-007', 'Mì Quảng', 'Mì Quảng đặc sản miền Trung với tôm, thịt và nước lèo đặc.', 48000, 'Món chính', 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop', 1),
('FOOD-008', 'Chả Giò (Nem Rán)', 'Chả giò giòn rụm nhân thịt, miến và rau củ.', 40000, 'Ăn nhẹ', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', 1),
('FOOD-009', 'Cà Phê Sữa Đá', 'Cà phê phin truyền thống với sữa đặc và đá.', 25000, 'Đồ uống', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=300&fit=crop', 1),
('FOOD-010', 'Trà Đào Cam Sả', 'Trà đào thơm mát với cam tươi và sả.', 35000, 'Đồ uống', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop', 1),
('FOOD-011', 'Chè Thái', 'Chè Thái đầy đủ topping: thạch, nước cốt dừa, trái cây.', 28000, 'Tráng miệng', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop', 1),
('FOOD-012', 'Bánh Flan Caramel', 'Bánh flan mềm mịn với caramel đắng nhẹ.', 20000, 'Tráng miệng', 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400&h=300&fit=crop', 1);
