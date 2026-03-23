CREATE DATABASE IF NOT EXISTS partition_demo;
USE partition_demo;

-- ========================
-- HORIZONTAL PARTITION
-- ========================

CREATE TABLE user_us (
                         id BIGINT PRIMARY KEY,
                         name VARCHAR(100),
                         region VARCHAR(10)
);

CREATE TABLE user_asia (
                           id BIGINT PRIMARY KEY,
                           name VARCHAR(100),
                           region VARCHAR(10)
);

-- ========================
-- VERTICAL PARTITION
-- ========================

CREATE TABLE user_basic (
                            id BIGINT PRIMARY KEY,
                            name VARCHAR(100)
);

CREATE TABLE user_detail (
                             id BIGINT PRIMARY KEY,
                             email VARCHAR(100),
                             address VARCHAR(255)
);

-- ========================
-- FUNCTIONAL PARTITION
-- ========================

CREATE TABLE orders (
                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        user_id BIGINT,
                        total DOUBLE
);

CREATE TABLE payments (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          order_id BIGINT,
                          status VARCHAR(50)
);