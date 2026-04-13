CREATE DATABASE IF NOT EXISTS movie_booking_system;
USE movie_booking_system;

-- ================================
-- 1. USER SERVICE
-- ================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 2. MOVIE SERVICE
-- ================================
CREATE TABLE movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT,
    release_date DATE,
    status ENUM('NOW_SHOWING', 'COMING_SOON', 'STOPPED') DEFAULT 'COMING_SOON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cinemas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255)
);

CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cinema_id BIGINT,
    name VARCHAR(100),
    total_seats INT,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id)
);

CREATE TABLE seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT,
    seat_number VARCHAR(10),
    seat_type ENUM('NORMAL', 'VIP') DEFAULT 'NORMAL',
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE showtimes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT,
    room_id BIGINT,
    start_time DATETIME,
    price DECIMAL(10,2),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- ================================
-- 3. BOOKING SERVICE
-- ================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    showtime_id BIGINT,
    total_amount DECIMAL(10,2),
    status ENUM('PENDING', 'CONFIRMED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    seat_id BIGINT,
    UNIQUE (booking_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- lock ghế để tránh double booking
CREATE TABLE seat_locks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    showtime_id BIGINT,
    seat_id BIGINT,
    locked_until DATETIME,
    status ENUM('LOCKED', 'RELEASED') DEFAULT 'LOCKED',
    UNIQUE (showtime_id, seat_id)
);

-- ================================
-- 4. PAYMENT SERVICE
-- ================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT,
    amount DECIMAL(10,2),
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 5. NOTIFICATION SERVICE
-- ================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message TEXT,
    status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 6. EVENT OUTBOX (QUAN TRỌNG)
-- ================================
CREATE TABLE event_outbox (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL
);

-- ================================
-- 7. EVENT CONSUMER LOG (idempotency)
-- ================================
CREATE TABLE event_consumer_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT,
    consumer_service VARCHAR(100),
    status ENUM('PROCESSED') DEFAULT 'PROCESSED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (event_id, consumer_service)
);

-- ================================
-- DUMMY DATA INSERTS
-- ================================

-- Insert Cinemas & Rooms
INSERT INTO cinemas (name, location) VALUES ('CGV Landmark', 'Landmark 81');
INSERT INTO rooms (cinema_id, name, total_seats) VALUES (1, 'Cinema 1', 20);

-- Insert Seats (A1 to A20 for Room 1)
INSERT INTO seats (room_id, seat_number, seat_type) VALUES 
(1, 'A1', 'NORMAL'), (1, 'A2', 'NORMAL'), (1, 'A3', 'NORMAL'), (1, 'A4', 'NORMAL'), (1, 'A5', 'NORMAL'),
(1, 'A6', 'NORMAL'), (1, 'A7', 'NORMAL'), (1, 'A8', 'NORMAL'), (1, 'A9', 'NORMAL'), (1, 'A10', 'NORMAL'),
(1, 'A11', 'NORMAL'), (1, 'A12', 'NORMAL'), (1, 'A13', 'NORMAL'), (1, 'A14', 'NORMAL'), (1, 'A15', 'NORMAL'),
(1, 'A16', 'NORMAL'), (1, 'A17', 'NORMAL'), (1, 'A18', 'NORMAL'), (1, 'A19', 'NORMAL'), (1, 'A20', 'NORMAL');

-- Insert Movies
INSERT INTO movies (title, description, duration, release_date, status) VALUES 
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 148, '2010-07-16', 'NOW_SHOWING'),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.', 169, '2014-11-07', 'NOW_SHOWING'),
('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality.', 136, '1999-03-31', 'NOW_SHOWING'),
('Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while acting as a leader against the conspirators.', 166, '2024-03-01', 'NOW_SHOWING');

-- Insert Showtimes
INSERT INTO showtimes (movie_id, room_id, start_time, price) VALUES 
(1, 1, '2024-12-31 18:00:00', 10.00),
(2, 1, '2024-12-31 21:00:00', 10.00),
(3, 1, '2025-01-01 18:00:00', 10.00),
(4, 1, '2025-01-01 21:00:00', 10.00);